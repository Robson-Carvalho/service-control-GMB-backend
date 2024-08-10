import { Router } from "express";

import { AuthMiddleware } from "../middlewares/auth";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
} from "../controllers/orderController";

export const orderRouter = Router();

orderRouter.post("/order", AuthMiddleware, createOrder);
orderRouter.get("/order", AuthMiddleware, getAllOrders);
orderRouter.get("/order/:_id", AuthMiddleware, getOrderById);
orderRouter.put("/order/:_id", AuthMiddleware, updateOrder);
orderRouter.delete("/order/:_id", AuthMiddleware, deleteOrder);
