import { Request, Response } from "express";
import { Community } from "../entity/Community";
import { validate, ValidationError } from "class-validator";
import { communityRepository } from "../repositories/communityRepository";
import { inhabitantRepository } from "../repositories/inhabitantRepository";

export const createCommunity = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Nome necessário." });
    }

    const existsCommunity = await communityRepository.findOneBy({ name });

    if (existsCommunity) {
      return res.status(400).json({ error: "Nome já utilizado." });
    }

    const community = new Community();
    community.name = name;

    const errors: ValidationError[] = await validate(community);
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

      return res.status(400).json(JSON.stringify({ errors: formattedErrors }));
    }

    const newCommunity = await communityRepository.create(community);
    await communityRepository.save(newCommunity);

    return res.status(201).json({
      community: newCommunity,
      message: "Nova comunidade adicionanda.",
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getAllCommunities = async (req: Request, res: Response) => {
  try {
    const communities = await communityRepository.find();
    return res.status(200).json(communities);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getCommunityById = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const community = await communityRepository.findOneBy({ _id });

    if (!community) {
      return res.status(404).json({ error: "Comunidade não encontrada" });
    }

    return res.status(200).json(community);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const getCommunityByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const community = await communityRepository.findOneBy({ name });

    if (!community) {
      return res.status(404).json({ error: "Comunidade não encontrada" });
    }

    return res.status(200).json(community);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const updateCommunity = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { name } = req.body;

    const community = await communityRepository.findOneBy({ _id });

    if (!community) {
      return res.status(404).json({ error: "Comunidade não encontrada" });
    }

    if (community.name === name) {
      return res.status(400).json({ error: "Nome já utilizado." });
    }

    community.name = name;

    const errors: ValidationError[] = await validate(community);
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

      return res.status(400).json(JSON.stringify({ errors: formattedErrors }));
    }

    await communityRepository.update({ _id }, community);

    return res.status(200).json({
      community,
      message: "Comunidade atualizada com sucesso.",
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;

    const community = await communityRepository.findOneBy({ _id });

    if (!community) {
      return res.status(404).json({ error: "Comunidade não encontrada" });
    }

    const inhabitants = await inhabitantRepository.findOneBy({
      communityID: _id,
    });

    if (inhabitants) {
      return res
        .status(400)
        .json({ error: "Existe habitante cadastrados nessa comunidade." });
    }

    await communityRepository.remove(community);

    return res
      .status(200)
      .json({ message: "Comunidade deletada com sucesso." });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};
