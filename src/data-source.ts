import { DataSource } from "typeorm";

const isProduction = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.DB_URL,
  useUnifiedTopology: true,
  entities: [
    isProduction ? __dirname + "/entity/*.js" : __dirname + "/entity/*.ts",
  ],
  synchronize: true,
});
