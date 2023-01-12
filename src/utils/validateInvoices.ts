import { readOrders } from "./readOrders";

import { invoice } from "../dtos/invoice";

export function validateInvoices(invoices: invoice[]): boolean {
  const orders = readOrders('src/Pedidos');

  invoices.forEach(invoice => {
    if (!orders[String(invoice.id_pedido)]) {
      throw new Error('Order not found!');
    };

    const orderItems = orders[String(invoice.id_pedido)]
      .map(order => order.número_item)
      .includes(invoice.número_item);

    if (!orderItems) {
      throw new Error('Item not found!');
    };
  });

  return true;
}