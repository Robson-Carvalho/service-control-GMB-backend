import { Request, Response } from "express";
import { Order, OrderStatusRole } from "../entity/Order";
import { orderRepository } from "../repositories/orderRepository";
import { validate, ValidationError } from "class-validator";
import { userRepository } from "../repositories/userRepository";
import { inhabitantRepository } from "../repositories/inhabitantRepository";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { content, userID, inhabitantID } = req.body;

    if (!content || !userID || !inhabitantID) {
      return res
        .status(400)
        .json({ error: "Content, userID, and inhabitantID are required" });
    }

    const userExists = await userRepository.findOneBy({ _id: userID });
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const inhabitantExists = await inhabitantRepository.findOneBy({
      _id: inhabitantID,
    });
    if (!inhabitantExists) {
      return res.status(404).json({ error: "Inhabitant not found" });
    }

    const order = new Order();
    order.content = content;
    order.userID = userID;
    order.inhabitantID = inhabitantID;
    order.status = OrderStatusRole.PENDING;

    const errors: ValidationError[] = await validate(order);
    if (errors.length > 0) {
      const formattedErrors = errors
        .map((error) => {
          if (error.constraints) {
            return {
              property: error.property,
              constraints: error.constraints,
            };
          }
          return null;
        })
        .filter((error) => error !== null);

      return res.status(400).json({ errors: formattedErrors });
    }

    const newOrder = orderRepository.create(order);
    await orderRepository.save(newOrder);

    return res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderRepository.find();
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    console.log(_id);

    const order = await orderRepository.findOneBy({ _id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { content, status } = req.body;

    const order = await orderRepository.findOneBy({ _id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (content !== undefined) order.content = content;
    if (status !== undefined) {
      const role =
        OrderStatusRole[status as keyof typeof OrderStatusRole] ||
        OrderStatusRole.PENDING;
      order.status = role;
    }

    order.date_update = new Date();

    const errors: ValidationError[] = await validate(order);
    if (errors.length > 0) {
      const formattedErrors = errors
        .map((error) => {
          if (error.constraints) {
            return {
              property: error.property,
              constraints: error.constraints,
            };
          }
          return null;
        })
        .filter((error) => error !== null);

      return res.status(400).json({ errors: formattedErrors });
    }

    await orderRepository.update({ _id }, order);

    return res
      .status(200)
      .json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    const order = await orderRepository.findOneBy({ _id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    await orderRepository.delete({ _id });

    return res
      .status(200)
      .json({ message: "Order deleted successfully", order: order._id });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
