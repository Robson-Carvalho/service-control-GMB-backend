import { Router } from "express";
import {
  createInhabitant,
  deleteInhabitant,
  getAllInhabitants,
  getInhabitantByCpf,
  updateInhabitant,
} from "../controllers/inhabitantController";
import { AuthMiddleware } from "../middlewares/auth";

export const inhabitantRouter = Router();

inhabitantRouter.post("/inhabitant", AuthMiddleware, createInhabitant);
inhabitantRouter.get("/inhabitant", AuthMiddleware, getAllInhabitants);
inhabitantRouter.get("/inhabitant/:cpf", AuthMiddleware, getInhabitantByCpf);
inhabitantRouter.put("/inhabitant/:_id", AuthMiddleware, updateInhabitant);
inhabitantRouter.delete("/inhabitant/:_id", AuthMiddleware, deleteInhabitant);
