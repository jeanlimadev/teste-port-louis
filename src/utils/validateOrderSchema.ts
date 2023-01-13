import { orderLine } from '../dtos/orderLine';

interface Schema {
  [param: string]: (order: any, fileName: string) => boolean;
}

export function validateOrderSchema(order: orderLine, fileName: string): boolean {
  const schemaValidation: Schema = {
    número_item: (order: orderLine, fileName: string): boolean => {
      if (typeof order.número_item != 'number') {
        throw `Error on file ${fileName}! The value of número_item must to be a number`;
      };

      if (!Number.isInteger(order.número_item)) {
        throw `Error on file ${fileName}! The value of número_item must to be a integer`;
      };

      if (order.número_item < 1) {
        throw `Error on file ${fileName}! The value of número_item cannot be less than 0`;
      };

      return true;
    },
    código_produto: (order: orderLine, fileName: string): boolean => {
      const regex = /^[a-zA-Z0-9]+$/;
      const isAlphanumeric = regex.test(order.código_produto);

      if (!isAlphanumeric || typeof order.código_produto != 'string') {
        throw `Error on file ${fileName}! The value of código_produto must to be a alphanumeric`;
      };

      return true;
    },
    quantidade_produto: (order: orderLine, fileName: string): boolean => {
      if (typeof order.quantidade_produto != 'number') {
        throw `Error on file ${fileName}! The value of quantidade_produto must to be a number`;
      };

      if (!Number.isInteger(order.quantidade_produto)) {
        throw `Error on file ${fileName}! The value of quantidade_produto must to be a integer`;
      };

      if (order.quantidade_produto < 1) {
        throw `Error on file ${fileName}! The value of quantidade_produto cannot be less than 0`;
      };

      return true;
    },
    valor_unitário_produto: (order: orderLine, fileName: string): boolean => {
      const regex = /^\d+(,\d+)?$/;
      const isNumericAndPositive = regex.test(order.valor_unitário_produto);
      const splittedValue = order.valor_unitário_produto.toString().split(',');

      if (!isNumericAndPositive) {
        throw `Error on file ${fileName}! The value of valor_unitário_produto must to be a numeric and positive`;
      };

      if (splittedValue[1]?.length > 2) {
        throw `Error on file ${fileName}! The value of valor_unitário_produto cannot exceed two decimal places`;
      };

      return true;
    },
  };

  for (const key in schemaValidation) {
    if (schemaValidation.hasOwnProperty(key)) {
      schemaValidation[key](order, fileName);
    };
  };

  return true;
}
