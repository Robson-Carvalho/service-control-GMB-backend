import { AppDataSource } from "../data-source";

import { Order } from "../entity/Order";

export const orderRepository = AppDataSource.getRepository(Order);
