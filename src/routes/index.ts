import { Router } from "express";
import { userRouter } from "./userRoutes";
import { authRouter } from "./authRoutes";
import { inhabitantRouter } from "./inhabitantRoutes";
import { orderRouter } from "./orderRoutes";
import { communityRouter } from "./communityRoutes";

export const router = Router();

router.use(userRouter);
router.use(authRouter);
router.use(inhabitantRouter);
router.use(orderRouter);
router.use(communityRouter);

router.get("*", async (req, res) => {
  return res.json({ menssage: "Hello, world!" });
});
