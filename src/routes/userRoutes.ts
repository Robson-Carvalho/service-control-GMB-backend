import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getByEmail,
  updateUser,
} from "../controllers/userController";

export const userRouter = Router();

userRouter.post("/user", createUser);
userRouter.get("/user", getAllUsers);
userRouter.get("/user/:email", getByEmail);
userRouter.patch("/user/:_id", updateUser);
userRouter.delete("/user/:_id", deleteUser);
