import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.DB_URL,
  useUnifiedTopology: true,
  entities: [__dirname + "/../**/*.entity.js"],
  synchronize: true,
});
