import { orderLine } from "./orderLine";

export interface order {
  [id_pedido: string]: orderLine[];
}