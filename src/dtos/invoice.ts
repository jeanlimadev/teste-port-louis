import { invoiceLine } from "./invoiceLine";

export interface invoice {
  [id_pedido: string]: invoiceLine[];
}