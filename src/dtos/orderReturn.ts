import { order } from "./order";

export interface orderReturn {
  [id_pedido: string]: order[];
}