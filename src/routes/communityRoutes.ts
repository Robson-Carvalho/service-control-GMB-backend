import { Router } from "express";

import { AuthMiddleware } from "../middlewares/auth";
import {
  createCommunity,
  deleteCommunity,
  getAllCommunities,
  getCommunityById,
  getCommunityByName,
  updateCommunity,
} from "../controllers/communityController";

export const communityRouter = Router();

communityRouter.post("/community", AuthMiddleware, createCommunity);
communityRouter.get("/community", AuthMiddleware, getAllCommunities);
communityRouter.get("/community/:_id", AuthMiddleware, getCommunityById);
communityRouter.get(
  "/community/query/name",
  AuthMiddleware,
  getCommunityByName
);
communityRouter.put("/community/:_id", AuthMiddleware, updateCommunity);
communityRouter.delete("/community/:_id", AuthMiddleware, deleteCommunity);
