import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { User, UserRole } from "../entity/User";
import { validate, ValidationError } from "class-validator";
import { hashPassword } from "../utils/hashPassword";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, password, email, userType } = req.body;

    if (!name || !password || !email) {
      return res
        .status(400)
        .json({ error: "Name, password, and email are required" });
    }

    const newUser = new User();
    newUser.name = name;
    newUser.password = password;
    newUser.email = email;
    newUser.userType = userType || UserRole.DEFAULT;

    const errors: ValidationError[] = await validate(newUser);

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

    newUser.password = await hashPassword(password);

    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = userRepository.create(newUser);
    await userRepository.save(user);

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find();

    const usersWithoutPasswords = users.map(
      ({ password: _, ...userWithoutPassword }) => userWithoutPassword
    );

    return res.status(200).json(usersWithoutPasswords);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const existingUser = await userRepository.findOneBy({ email });

    if (!existingUser) {
      return res.status(404).json({ error: "Email not registered" });
    }

    const { password: _, ...userWithoutPassword } = existingUser;

    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const existingUser = await userRepository.findOneBy({ _id });

    if (!existingUser) {
      return res.status(404).json({ error: "User not registered" });
    }

    existingUser.name = name;

    const errors: ValidationError[] = await validate(existingUser);

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

    await userRepository.update({ _id }, existingUser);

    const { password: _, ...userWithoutPassword } = existingUser;

    return res.status(200).json({
      message: "User updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    const existingUser = await userRepository.findOneBy({ _id });

    if (!existingUser) {
      return res.status(404).json({ error: "User not registered" });
    }

    await userRepository.delete({ _id: existingUser._id });

    return res.status(200).json(existingUser._id);
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
