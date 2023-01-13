import fs from 'fs';

import { validateItemsNumbers } from './validateItemsNumbers';
import { validateOrderSchema } from './validateOrderSchema';

import { orderLine } from '../dtos/orderLine';
import { order } from '../dtos/order';

export function readOrders(path: string): order {
  const orders: orderLine[] = [];
  const files = fs.readdirSync(path);

  files.forEach(file => {
    const content = fs.readFileSync(path + '/' + file, 'utf-8');
    const contentToJson = content.split('\n').map(line => JSON.parse(line.trim()));

    contentToJson.forEach(orderItem => {
      validateOrderSchema(orderItem, file);
      
      orders.push({
        id_pedido: file.replace('.txt', '').replace('P', ''),
        ...orderItem
      });
    });
  });

  const ordersArrayToObject = orders.reduce((accumulator: order, current: orderLine) => {
    if (accumulator[current.id_pedido]) {
      accumulator[current.id_pedido].push(current);
    } else {
      accumulator[current.id_pedido] = [current];
    };

    return accumulator;
  }, {});

  validateItemsNumbers(ordersArrayToObject);

  return ordersArrayToObject;
};