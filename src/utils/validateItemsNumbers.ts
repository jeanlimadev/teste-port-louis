import { order } from '../dtos/order';

export function validateItemsNumbers(orders: order): boolean {
  for (const key in orders) {
    const items = orders[key].map(orderItem => {
      return orderItem.número_item;
    }).sort((a: number, b: number) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

    const hasDuplicates = new Set(items).size !== items.length;

    if (hasDuplicates) {
      throw `There are duplicate items on order ${key}!`;
    };

    if (!itemsOrderIsCorrect(items)) {
      throw `Items are not in sequence on order ${key}`;
    };

  }
  return true;
}

function itemsOrderIsCorrect(arr: number[]) {
  for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i + 1] - arr[i] != 1) {
          return false;
      };
  };
  return true;
}