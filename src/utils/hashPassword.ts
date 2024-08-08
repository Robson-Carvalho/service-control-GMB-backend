import { hash } from "bcryptjs";

export const hashPassword = async (password: string) => {
  return hash(password, parseInt(process.env.SSALT_ROUNDS as string));
};
