import { AppDataSource } from "../data-source";

import { Inhabitant } from "../entity/Inhabitant";

export const inhabitantRepository = AppDataSource.getRepository(Inhabitant);
