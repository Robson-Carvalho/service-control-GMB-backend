import { Request, Response } from "express";
import { Order, OrderStatusRole } from "../entity/Order";
import { orderRepository } from "../repositories/orderRepository";
import { validate, ValidationError } from "class-validator";
import { userRepository } from "../repositories/userRepository";
import { inhabitantRepository } from "../repositories/inhabitantRepository";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { content, userID, inhabitantID } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Conteúdo é necessário." });
    } else if (!userID || !inhabitantID) {
      return res.status(400).json({ error: "Erro interno no método." });
    }

    const userExists = await userRepository.findOneBy({ _id: userID });
    if (!userExists) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const inhabitantExists = await inhabitantRepository.findOneBy({
      _id: inhabitantID,
    });
    if (!inhabitantExists) {
      return res.status(404).json({ error: "Habitante não encontrado." });
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

      throw new Error(JSON.stringify({ errors: formattedErrors }));
    }

    const newOrder = await orderRepository.create(order);
    await orderRepository.save(newOrder);

    return res
      .status(201)
      .json({ order: newOrder, message: "Pedido criado com sucesso." });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderRepository.find();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    const order = await orderRepository.findOneBy({ _id });
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { content, status } = req.body;

    const order = await orderRepository.findOneBy({ _id });
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
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
      .json({ message: "Pedido atualizado com sucesso.", order });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    const order = await orderRepository.findOneBy({ _id });
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    await orderRepository.delete({ _id });

    return res
      .status(200)
      .json({ message: "Pedido deletado com sucesso.", order: order._id });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getOrdersWithCommunity = async (req: Request, res: Response) => {
  try {
    const currentYear = new Date().getFullYear();

    const orders = await orderRepository.find();

    const filteredOrders = await Promise.all(
      orders
        .filter((order) => new Date(order.date).getFullYear() === currentYear)
        .map(async (order) => {
          const inhabitant = await inhabitantRepository.findOneBy({
            _id: order.inhabitantID,
          });

          const formattedDate = new Date(order.date).toLocaleDateString(
            "pt-BR",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }
          );

          return {
            community: inhabitant?.address.community || "Unknown",
            date: formattedDate,
          };
        })
    );

    return res.status(200).json(filteredOrders);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};
