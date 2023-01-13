import fs from 'fs';

import { getOrdersPending } from './getOrdersPending';
import { readOrders } from './readOrders';
import { formatObjectToString } from './formatObjectToString';

import { report } from '../dtos/report';

interface PendingItems {
  número_item: number;
  saldo_quantidade: number;
}

export function compareFilesAndWriteBalanceFile(pathOrders: string, pathInvoices: string) {
  const orders = readOrders(pathOrders);
  const ordersPending = getOrdersPending(pathOrders, pathInvoices);
  
  const ordersTotal = [];
  
  for (const key in orders) {
    let total = 0;
  
    orders[key].forEach(item => {
      total += item.quantidade_produto * parseFloat(item.valor_unitário_produto.replace(',', '.'));
    });
  
    const orderReturn = {
      id_pedido: key,
      valor_total_pedido: total.toFixed(2).replace('.', ',')
    };
  
    ordersTotal.push(orderReturn);
  };
  
  const finalReport: report[] = [];
  
  for (const key in ordersPending) {
    let order = ordersTotal.filter(item => item.id_pedido === key);
  
    let pendingTotal = 0;
    
    const itens_pendentes = ordersPending[key].map(item => {
      const pendingItems: PendingItems = {
        número_item: item.número_item,
        saldo_quantidade: item.quantidade_produto
      }

      return pendingItems;
    }).sort((a: PendingItems, b: PendingItems) => {
      if (a.número_item < b.número_item) return -1;
      if (a.número_item > b.número_item) return 1;
      return 0;
    });
  
    ordersPending[key].forEach(item => {
      pendingTotal += item.quantidade_produto * parseFloat(item.valor_unitário_produto.replace(',', '.'));
    });
  
    const report: report = {
      id_pedido: key,
      valor_total_pedido: order[0].valor_total_pedido,
      saldo_pendente: pendingTotal.toFixed(2).replace('.', ','),
      itens_pendentes
    };
  
    finalReport.push(report);
  }
  
  const ordersToStringFormat = formatObjectToString(finalReport);
  
  try {
    const fileName = 'pedidos-pendentes.txt'
    fs.writeFileSync(fileName, ordersToStringFormat);
    console.log(`File ${fileName} created!`);
  } catch (error) {
    console.log({message: 'Error!', error: error});
  };
};