import { order } from "../dtos/order";
import { orderReturn } from "../dtos/orderReturn";
import { readInvoices } from "./readInvoices";
import { readOrders } from "./readOrders";

export function getOrdersPending(pathOrders: string, pathInvoices: string): orderReturn {
  const orders = readOrders(pathOrders);
  const invoices = readInvoices(pathInvoices);

  const ordersPending: order[] = [];

  for (const key in orders) {
    orders[key].map(order => {
      const invoicesFiltered = invoices.filter(invoice => String(invoice.id_pedido) === String(order.id_pedido) && invoice.número_item === order.número_item);
    
      if(invoicesFiltered.length > 0) {
        let soma = 0;
        invoicesFiltered.forEach(item => {
          soma += Number(item.quantidade_produto);
        });

        if (soma > order.quantidade_produto) {
          throw new Error(`Error! Sum of items on invoices referring to item ${order.número_item} on order ${order.id_pedido} exceed available amount.`);
        };
    
        order.quantidade_produto -= soma;
      }
    
      ordersPending.push(order);
    });
  };

  const ordersPendingFiltered = ordersPending.reduce((accumulator: orderReturn, current: order) => {
    if (current.quantidade_produto <= 0) {
      null
    } else if (accumulator[current.id_pedido]) {
      accumulator[current.id_pedido].push(current);
    } else {
      accumulator[current.id_pedido] = [current];
    };

    return accumulator;
  }, {})

  return ordersPendingFiltered;
};