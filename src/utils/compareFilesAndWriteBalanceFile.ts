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
  
  const ordersTotal = [];
  
  for (const key in ordersReduced) {
    let total = 0;
  
    ordersReduced[key].forEach(item => {
      total += item.quantidade_produto * parseFloat(item.valor_unitário_produto.replace(",", "."));
    });
  
    const orderReturn = {
      id_pedido: key,
      valor_total_pedido: total.toFixed(2).replace(".", ",")
    };
  
    ordersTotal.push(orderReturn);
  };
  
  const finalReport: report[] = [];
  
  for (const key in ordersPendingReduced) {
    let order = ordersTotal.filter(item => item.id_pedido === key);
  
    let pendingTotal = 0;
    
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
      pendingTotal += item.quantidade_produto * parseFloat(item.valor_unitário_produto.replace(",", "."));
    });
  
    const report: report = {
      id_pedido: key,
      valor_total_pedido: order[0].valor_total_pedido,
      saldo_pendente: pendingTotal.toFixed(2).replace(".", ","),
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