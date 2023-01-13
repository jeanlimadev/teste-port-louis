import { readInvoices } from './readInvoices';
import { readOrders } from './readOrders';

import { orderLine } from '../dtos/orderLine';
import { order } from '../dtos/order';

export function getOrdersPending(pathOrders: string, pathInvoices: string): order {
  const orders = readOrders(pathOrders);
  const invoices = readInvoices(pathInvoices);

  const ordersPending: orderLine[] = [];

  for (const key in orders) {
    orders[key].map(orderItem => {
      const referringInvoices = invoices.filter(invoice => String(invoice.id_pedido) === String(orderItem.id_pedido) && invoice.número_item === orderItem.número_item);
    
      if(referringInvoices.length > 0) {
        let soma = 0;
        referringInvoices.forEach(invoiceItem => {
          soma += invoiceItem.quantidade_produto;
        });

        if (soma > orderItem.quantidade_produto) {
          throw new Error(`Error! Sum of items on invoices referring to item ${orderItem.número_item} on order ${orderItem.id_pedido} exceed available amount.`);
        };
    
        orderItem.quantidade_produto -= soma;
      }
    
      ordersPending.push(orderItem);
    });
  };

  const ordersArrayToObject = ordersPending.reduce((accumulator: order, current: orderLine) => {
    if (current.quantidade_produto <= 0) {
      null
    } else if (accumulator[current.id_pedido]) {
      accumulator[current.id_pedido].push(current);
    } else {
      accumulator[current.id_pedido] = [current];
    };

    return accumulator;
  }, {})

  return ordersArrayToObject;
};