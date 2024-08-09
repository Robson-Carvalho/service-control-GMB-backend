import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import { router } from "./routes";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app = express();

app.use(
  cors({
    origin: process.env.CORS,
    methods: ["GET", "POST", "DELETE", "PATCH"],
  })
);
app.use(express.json());

app.use("/v1", router);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log("Application is up and running");
});
