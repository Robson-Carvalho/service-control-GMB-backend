import { Router } from "express";
import { userRouter } from "./userRoutes";
import { authRouter } from "./authRoutes";

export const router = Router();

router.get("/", async (req, res) => {
  return res.json({ menssage: "Hello, world!" });
});

router.use(userRouter);
router.use(authRouter);
