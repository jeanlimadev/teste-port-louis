import { invoice } from "./invoice";

export interface invoiceReturn {
  [id_pedido: string]: invoice[];
}