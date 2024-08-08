import { sign } from "jsonwebtoken";

export const signToken = async (_id: string) => {
  return sign({ id: _id }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "1d",
  });
};
