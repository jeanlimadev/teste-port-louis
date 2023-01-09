import fs from "fs";

import { getOrdersPending } from "./getOrdersPending";
import { readOrders } from "./readOrders";

import { order } from "../dtos/order";
import { orderReturn } from "../dtos/orderReturn";
import { report } from "../dtos/report";
import { formatObjectToString } from "./formatObjectToString";

export function compareFilesAndWriteBalanceFile(pathOrders: string, pathInvoices: string) {
  const orders = readOrders(pathOrders);

  const ordersPending = getOrdersPending(pathOrders, pathInvoices);

  const ordersReduced = orders.reduce((accumulator: orderReturn, current: order) => {
    if (accumulator[current.id_pedido]) {
      accumulator[current.id_pedido].push(current);
    } else {
      accumulator[current.id_pedido] = [current];
    }

    return accumulator;
  }, {});

  const ordersPendingReduced = ordersPending.reduce((accumulator: orderReturn, current: order) => {
    if (accumulator[current.id_pedido]) {
      accumulator[current.id_pedido].push(current);
    } else {
      accumulator[current.id_pedido] = [current];
    }
  
    return accumulator;
  }, {});
  
  const totalPedidos = [];
  
  for (const key in ordersReduced) {
    let valor_total_pedido = 0;
  
    ordersReduced[key].forEach(item => {
      valor_total_pedido += item.quantidade_produto * parseFloat(item.valor_unitário_produto.replace(",", "."));
    });
  
    const orderReturn = {
      id_pedido: key,
      valor_total_pedido
    };
  
    totalPedidos.push(orderReturn);
  };
  
  const finalReport: report[] = [];
  
  for (const key in ordersPendingReduced) {
    let valor_total_pedido = totalPedidos.filter(item => item.id_pedido === key);
  
    let saldo_pendente = 0;
    
    const itens_pendentes = ordersPendingReduced[key].map(item => {
      return {
        número_item: item.número_item,
        saldo_quantidade: item.quantidade_produto
      };
    }).sort((a, b) => {
      if (a.número_item < b.número_item) return -1;
      if (a.número_item > b.número_item) return 1;
      return 0;
    });
  
    ordersPendingReduced[key].forEach(item => {
      saldo_pendente += item.quantidade_produto * parseFloat(item.valor_unitário_produto.replace(",", "."));
    });
  
    const report: report = {
      id_pedido: key,
      valor_total_pedido: valor_total_pedido[0].valor_total_pedido,
      saldo_pendente,
      itens_pendentes
    };
  
    finalReport.push(report);
  }
  
  const ordersToStringFormat = formatObjectToString(finalReport);
  
  try {
    fs.writeFileSync("pedidos-pendentes.txt", ordersToStringFormat);
    console.log("File created!");
  } catch (error) {
    console.log({message: "Error!", error: error});
  }
}