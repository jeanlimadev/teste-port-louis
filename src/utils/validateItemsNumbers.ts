import { orderReturn } from "../dtos/orderReturn";

export function validateItemsNumbers(orders: orderReturn): boolean {
  for (const key in orders) {
    const items = orders[key].map(item => {
      return item.número_item;
    }).sort((a: number, b: number) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

    const hasDuplicates = new Set(items).size !== items.length;

    if (hasDuplicates) {
      throw new Error(`There are duplicate items on order ${key}!`);
    };

    if (!itemsOrderIsCorrect(items)) {
      throw new Error(`Items are not in sequence on order ${key}`);
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