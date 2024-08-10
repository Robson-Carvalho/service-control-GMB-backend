import { DataSource } from "typeorm";

import { User } from "./entity/User";
import { Inhabitant } from "./entity/Inhabitant";
import { Order } from "./entity/Order";

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.DB_URL,
  useUnifiedTopology: true,
  entities: [User, Inhabitant, Order],
  synchronize: true,
});
