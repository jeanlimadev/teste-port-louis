import fs from 'fs';

import { order } from '../dtos/order';
import { orderReturn } from '../dtos/orderReturn';
import { validateItemsNumbers } from './validateItemsNumbers';
import { validateOrderSchema } from './validateOrderSchema';

export function readOrders(dir: string): orderReturn {
  const orders: order[] = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const content = fs.readFileSync(dir + '/' + file, 'utf-8');
    const contentToJson = content.split('\n').map(line => JSON.parse(line.trim()));

    contentToJson.forEach(order => {
      validateOrderSchema(order, file)

      orders.push({
        id_pedido: file.replace('.txt', '').replace('P', ''),
        ...order
      });
    });
  });

  const ordersObject = orders.reduce((accumulator: orderReturn, current: order) => {
    if (accumulator[current.id_pedido]) {
      accumulator[current.id_pedido].push(current);
    } else {
      accumulator[current.id_pedido] = [current];
    };

    return accumulator;
  }, {});

  validateItemsNumbers(ordersObject);

  return ordersObject;
};