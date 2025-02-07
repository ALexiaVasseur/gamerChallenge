import { Router } from "express";
import { router as userRouter } from "./user_router.js";

export const router = Router();

router.use(userRouter);

router.use((req, res) => {
    res.status(404).json({ error: "Vérifiez le endpoint"});
});