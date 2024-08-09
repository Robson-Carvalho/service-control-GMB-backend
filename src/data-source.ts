import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.DB_URL,
  useUnifiedTopology: true,
  entities: [__dirname + "/dist/entity/*.js", __dirname + "/entity/*.ts"],
  synchronize: true,
});
