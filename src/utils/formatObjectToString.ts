import { report } from '../dtos/report';

export function formatObjectToString(ordersPending: report[]): string {
  const ordersString = ordersPending.reduce((accumulator, current) => {
    accumulator += JSON.stringify(current) + '\n';

    return accumulator
  }, '');

  return ordersString;
}