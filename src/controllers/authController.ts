import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { comparePassword } from "../utils/comparePassword";
import { signToken } from "../utils/signToken";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await userRepository.findOneBy({ email });

    if (!existingUser) {
      return res.status(400).json({ error: "Email or password invalid" });
    }

    const isValidPassword = await comparePassword(
      password,
      existingUser.password
    );

    if (!isValidPassword) {
      return res.status(400).json({ error: "Email or password invalid" });
    }

    const token = await signToken(existingUser._id);

    const { password: _, ...userWithoutPassword } = existingUser;

    return res.status(200).json({ userData: userWithoutPassword, token });
  } catch (error) {
    console.error("Error login user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
