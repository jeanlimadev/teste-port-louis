import { report } from "../dtos/report";

export function formatObjectToString(ordersPending: report[]): string {
    let ordersString = "";
  
    ordersPending.forEach(item => {
      ordersString += JSON.stringify(item) + "\n";
    });
  
    return ordersString;
}