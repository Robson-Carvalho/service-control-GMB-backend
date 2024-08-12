import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getByEmail,
  updateUser,
} from "../controllers/userController";
import { AuthMiddleware } from "../middlewares/auth";

export const userRouter = Router();

userRouter.post("/user", createUser);
userRouter.get("/user", getAllUsers);
userRouter.get("/user/:email", AuthMiddleware, getByEmail);
userRouter.patch("/user/:_id", AuthMiddleware, updateUser);
userRouter.delete("/user/:_id", AuthMiddleware, deleteUser);
