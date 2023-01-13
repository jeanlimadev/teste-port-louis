import { invoiceLine } from '../dtos/invoiceLine';

interface Schema {
  [param: string]: (invoice: invoiceLine, fileName: string) => boolean;
}

export function validateInvoiceSchema(invoice: invoiceLine, fileName: string): boolean {
  const schemaValidation: Schema = {
    id_pedido: (invoice: invoiceLine, fileName: string): boolean => {
      const regex = /^[a-zA-Z0-9]+$/;
      const isAlphanumeric = regex.test(invoice.id_pedido);

      if (!isAlphanumeric) {
        throw new Error(`Error on file ${fileName}! The value of id_pedido must to be a alphanumeric`);
      };

      return true;
    },
    número_item: (invoice: invoiceLine, fileName: string): boolean => {
      if (typeof invoice.número_item != 'number') {
        throw new Error(`Error on file ${fileName}! The value of número_item on file must to be a number`);
      };

      if (!Number.isInteger(invoice.número_item)) {
        throw new Error(`Error on file ${fileName}! The value of número_item must to be a integer`);
      };

      if (invoice.número_item < 1) {
        throw new Error(`Error on file ${fileName}! The value of número_item cannot be less than 0`);
      };

      return true;
    },
    quantidade_produto: (invoice: invoiceLine, fileName: string): boolean => {
      if (typeof invoice.quantidade_produto != 'number') {
        throw new Error(`Error on file ${fileName}! The value of quantidade_produto must to be a number`);
      };

      if (!Number.isInteger(invoice.quantidade_produto)) {
        throw new Error(`Error on file ${fileName}! The value of quantidade_produto must to be a integer`);
      };

      if (invoice.quantidade_produto < 1) {
        throw new Error(`Error on file ${fileName}! The value of quantidade_produto cannot be less than 0`);
      };

      return true;
    },
  };

  for (const key in schemaValidation) {
    if (schemaValidation.hasOwnProperty(key)) {
      schemaValidation[key](invoice, fileName);
    };
  };

  return true;
}
