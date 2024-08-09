import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.DB_URL,
  useUnifiedTopology: true,
  entities: [User],
  synchronize: true,
});
