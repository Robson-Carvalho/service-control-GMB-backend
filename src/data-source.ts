import { DataSource } from "typeorm";

import { User } from "./entity/User";
import { Inhabitant } from "./entity/Inhabitant";

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.DB_URL,
  useUnifiedTopology: true,
  entities: [User, Inhabitant],
  synchronize: true,
});
