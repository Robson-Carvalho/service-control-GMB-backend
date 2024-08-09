import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import { router } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    const PORT = process.env.PORT || 3030;
    app.listen(PORT, () => {
      console.log("Application is up and running");
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });

app.use("/v1", router);
