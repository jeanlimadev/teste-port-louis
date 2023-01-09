import { order } from "../dtos/order";
import { readInvoices } from "./readInvoices";
import { readOrders } from "./readOrders";

export function getOrdersPending(pathOrders: string, pathInvoices: string): order[] {
  const orders = readOrders(pathOrders);
  const invoices = readInvoices(pathInvoices);

  const ordersPending = orders.map(order => {
    const invoicesFiltered = invoices.filter(invoice => invoice.id_pedido === Number(order.id_pedido) && invoice.número_item === order.número_item);
  
    if(invoicesFiltered.length > 0) {
      let soma = 0;
      invoicesFiltered.forEach(item => {
        soma += Number(item.quantidade_produto);
      });
  
      order.quantidade_produto -= soma;
    }
  
    return order;
  });

  const ordersPendingFiltered = ordersPending.filter(order => order.quantidade_produto > 0);

  return ordersPendingFiltered;
}