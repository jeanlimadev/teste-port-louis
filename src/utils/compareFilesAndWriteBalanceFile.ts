import fs from 'fs';

import { getOrdersPending } from './getOrdersPending';
import { readOrders } from './readOrders';
import { formatObjectToString } from './formatObjectToString';

import { report } from '../dtos/report';
import { pendingItems } from '../dtos/pendingItems';


export function compareFilesAndWriteBalanceFile(pathOrders: string, pathInvoices: string) {
  const orders = readOrders(pathOrders);
  const ordersPending = getOrdersPending(pathOrders, pathInvoices);
  
  const ordersTotal = [];
  
  for (const key in orders) {
    let total = 0;
  
    orders[key].forEach(line => {
      total += line.quantidade_produto * parseFloat(line.valor_unitário_produto.replace(',', '.'));
    });
  
    ordersTotal.push({
      id_pedido: key,
      valor_total_pedido: total.toFixed(2).replace('.', ',')
    });
  };
  
  const finalReport: report[] = [];
  
  for (const key in ordersPending) {
    const order = ordersTotal.filter(item => item.id_pedido === key);
  
    let pendingTotal = 0;
    
    const itens_pendentes: pendingItems[] = ordersPending[key].map(line => {
      return {
        número_item: line.número_item,
        saldo_quantidade: line.quantidade_produto
      };
    }).sort((a, b) => {
      if (a.número_item < b.número_item) return -1;
      if (a.número_item > b.número_item) return 1;
      return 0;
    });
  
    ordersPending[key].forEach(line => {
      pendingTotal += line.quantidade_produto * parseFloat(line.valor_unitário_produto.replace(',', '.'));
    });
  
    finalReport.push({
      id_pedido: key,
      valor_total_pedido: order[0].valor_total_pedido,
      saldo_pendente: pendingTotal.toFixed(2).replace('.', ','),
      itens_pendentes
    });
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