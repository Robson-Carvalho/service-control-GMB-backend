import { Request, Response } from "express";
import { validate, ValidationError } from "class-validator";

import { inhabitantRepository } from "../repositories/inhabitantRepository";
import { Inhabitant } from "../entity/Inhabitant";

export const createInhabitant = async (req: Request, res: Response) => {
  try {
    const { name, cpf, numberPhone, address } = req.body;

    if (!name || !cpf || !address?.street || !address?.number) {
      return res
        .status(400)
        .json({ error: "Name, CPF and address are required" });
    }

    const newInhabitant = new Inhabitant();
    newInhabitant.name = name;
    newInhabitant.cpf = cpf;
    newInhabitant.numberPhone = numberPhone;
    newInhabitant.address = {
      street: address.street,
      number: address.number,
    };

    const errors: ValidationError[] = await validate(newInhabitant);

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

    const existingInhabitant = await inhabitantRepository.findOneBy({ cpf });
    if (existingInhabitant) {
      return res.status(400).json({ error: "CPF already in use" });
    }

    const inhabitant = inhabitantRepository.create(newInhabitant);
    await inhabitantRepository.save(inhabitant);

    return res
      .status(201)
      .json({ inhabitant, message: "Inhabitant created successfully" });
  } catch (error) {
    console.error("Error creating inhabitant:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllInhabitants = async (req: Request, res: Response) => {
  try {
    const inhabitants = await inhabitantRepository.find();
    return res.status(200).json(inhabitants);
  } catch (error) {
    console.error("Error fetching inhabitants:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getInhabitantByCpf = async (req: Request, res: Response) => {
  try {
    const { cpf } = req.params;

    const existingInhabitant = await inhabitantRepository.findOneBy({ cpf });

    if (!existingInhabitant) {
      return res.status(404).json({ error: "Inhabitant not registered" });
    }

    return res.status(200).json(existingInhabitant);
  } catch (error) {
    console.error("Error fetching inhabitant:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateInhabitant = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { name, cpf, numberPhone, address } = req.body;

    if (!name || !cpf || !address?.street || !address?.number) {
      return res
        .status(400)
        .json({ error: "Name, CPF and address are required" });
    }

    const existingInhabitant = await inhabitantRepository.findOneBy({
      _id,
    });

    if (!existingInhabitant) {
      return res.status(404).json({ error: "Inhabitant not registered" });
    }

    existingInhabitant.name = name;
    existingInhabitant.cpf = cpf;
    existingInhabitant.numberPhone = numberPhone;
    existingInhabitant.address = {
      street: address.street,
      number: address.number,
    };

    const errors: ValidationError[] = await validate(existingInhabitant);

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

    await inhabitantRepository.update({ _id }, existingInhabitant);

    return res.status(200).json({
      message: "Inhabitant updated successfully",
      inhabitant: existingInhabitant,
    });
  } catch (error) {
    console.error("Error updating inhabitant:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteInhabitant = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    const existingInhabitant = await inhabitantRepository.findOneBy({
      _id,
    });

    if (!existingInhabitant) {
      return res.status(404).json({ error: "Inhabitant not registered" });
    }

    await inhabitantRepository.delete({ _id });

    return res.status(200).json({ message: "Inhabitant deleted successfully" });
  } catch (error) {
    console.error("Error deleting inhabitant:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
