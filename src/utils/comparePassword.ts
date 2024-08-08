import { compare } from "bcryptjs";

export const comparePassword = async (
  sendPassword: string,
  hashPassword: string
) => {
  return compare(sendPassword, hashPassword);
};
