import { AppDataSource } from "../data-source";

import { Community } from "../entity/Community";

export const communityRepository = AppDataSource.getRepository(Community);
