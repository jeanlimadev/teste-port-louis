import fs from 'fs';

import { order } from '../dtos/order';
import { validateOrderSchema } from './validateOrderSchema';

export function readOrders(dir: string): order[] {
  const orders: order[] = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const content = fs.readFileSync(dir + '/' + file, 'utf-8');
    const contentToJson = content.split('\n').map(line => JSON.parse(line.trim()));

    contentToJson.forEach(order => {
      validateOrderSchema(order)
      orders.push({
        id_pedido: file.replace('.txt', '').replace('P', ''),
        ...order
      });
    });
  });

  return orders;
};