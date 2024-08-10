import { Router } from "express";
import { userRouter } from "./userRoutes";
import { authRouter } from "./authRoutes";
import { inhabitantRouter } from "./inhabitantRoutes";

export const router = Router();

router.get("/", async (req, res) => {
  return res.json({ menssage: "Hello, world!" });
});

router.use(userRouter);
router.use(authRouter);
router.use(inhabitantRouter);
