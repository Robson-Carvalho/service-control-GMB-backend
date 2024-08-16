import { Request, Response } from "express";
import { validate, ValidationError } from "class-validator";

import { inhabitantRepository } from "../repositories/inhabitantRepository";
import { Inhabitant } from "../entity/Inhabitant";
import { sanitizeCpf } from "../utils/sanitizeCpf";
import { communityRepository } from "../repositories/communityRepository";

export const createInhabitant = async (req: Request, res: Response) => {
  try {
    const { name, numberPhone, address, communityID } = req.body;

    let { cpf } = req.body;
    cpf = sanitizeCpf(cpf);

    if (!name || !cpf || !address?.street || !communityID || !address?.number) {
      return res
        .status(400)
        .json({ error: "Nome, CPF e endereço são requeridos." });
    }

    const newInhabitant = new Inhabitant();
    newInhabitant.name = name;
    newInhabitant.cpf = cpf;
    newInhabitant.numberPhone = numberPhone;
    newInhabitant.address = {
      street: address.street,
      number: address.number,
    };
    newInhabitant.communityID = communityID;

    const community = await communityRepository.findOneBy({ _id: communityID });

    if (!community) {
      return res.status(404).json({ error: "Comunidade não encontrada" });
    }

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
      return res.status(400).json({ error: "CPF está em uso!" });
    }

    const inhabitant = inhabitantRepository.create(newInhabitant);
    await inhabitantRepository.save(inhabitant);

    return res
      .status(201)
      .json({ inhabitant, message: "Habitante adicionando com sucesso!" });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getAllInhabitants = async (req: Request, res: Response) => {
  try {
    const inhabitants = await inhabitantRepository.find();
    const communities = await communityRepository.find();

    const communityMap = new Map<string, string>();
    communities.forEach((community) => {
      communityMap.set(community._id.toString(), community.name);
    });

    const inhabitantsWithCommunityName = inhabitants.map((inhabitant) => {
      return {
        ...inhabitant,
        communityName:
          communityMap.get(inhabitant.communityID.toString()) ||
          "Comunidade Desconhecida",
      };
    });

    return res.status(200).json(inhabitantsWithCommunityName);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro ao buscar habitantes:", {
        message: error.message,
        stack: error.stack,
        context: "Função getAllInhabitants",
      });
    } else {
      console.error("Erro desconhecido:", error);
    }
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getInhabitantByCpf = async (req: Request, res: Response) => {
  try {
    const { cpf } = req.params;

    const existingInhabitant = await inhabitantRepository.findOneBy({ cpf });

    if (!existingInhabitant) {
      return res.status(404).json({ error: "Habitante não encontrado" });
    }

    return res.status(200).json(existingInhabitant);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const updateInhabitant = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { name, numberPhone, address, communityID } = req.body;
    let { cpf } = req.body;
    cpf = sanitizeCpf(cpf);

    if (!name || !cpf || !address?.street || !address?.number) {
      return res
        .status(400)
        .json({ error: "Nome, CPF e endereço são requeridos." });
    }

    const existingInhabitant = await inhabitantRepository.findOneBy({
      _id,
    });

    if (!existingInhabitant) {
      return res.status(404).json({ error: "Habitante não encontrado." });
    }

    let addressSteet = address.street
      ? address.street
      : existingInhabitant.address.street;

    let addressNumber = address.number
      ? address.number
      : existingInhabitant.address.number;

    existingInhabitant.name = name;
    existingInhabitant.cpf = cpf;
    existingInhabitant.numberPhone = numberPhone;
    existingInhabitant.address = {
      street: addressSteet,
      number: addressNumber,
    };
    existingInhabitant.communityID = communityID;

    const community = await communityRepository.findOneBy({ _id: communityID });

    if (!community) {
      return res.status(404).json({ error: "Comunidade não encontrada" });
    }

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
      message: "Habitante atualizado com sucesso.",
      inhabitant: existingInhabitant,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const deleteInhabitant = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    const existingInhabitant = await inhabitantRepository.findOneBy({
      _id,
    });

    if (!existingInhabitant) {
      return res.status(404).json({ error: "Habitante não encontrado." });
    }

    await inhabitantRepository.delete({ _id });

    return res.status(200).json({ message: "Habitante deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};
