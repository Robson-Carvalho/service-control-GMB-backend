import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/verifyToken";

type TokenPaylod = {
  id: string;
  iat: number;
  exp: number;
};

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const [, token] = authorization.split(" ");

  try {
    const decoded = await verifyToken(token);
    const { id } = decoded as TokenPaylod;
    req.userId = id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalid" });
  }
};
