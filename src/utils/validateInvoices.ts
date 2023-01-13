import { readOrders } from './readOrders';

import { invoiceLine } from '../dtos/invoiceLine';

export function validateInvoices(invoices: invoiceLine[]): boolean {
  const orders = readOrders('src/Pedidos');

  invoices.forEach(invoiceItem => {
    if (!orders[String(invoiceItem.id_pedido)]) {
      throw new Error(`Order ${invoiceItem.id_pedido} not found!`);
    };

    const orderNumberItems = orders[String(invoiceItem.id_pedido)]
      .map(orderItem => orderItem.número_item)
      .includes(invoiceItem.número_item);

    if (!orderNumberItems) {
      throw new Error(`Item ${invoiceItem.número_item} not found on order ${invoiceItem.id_pedido}!`);
    };
  });

  return true;
}