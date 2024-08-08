import { verify } from "jsonwebtoken";

export const verifyToken = async (token: string) => {
  return verify(token, process.env.JWT_SECRET_KEY as string);
};
