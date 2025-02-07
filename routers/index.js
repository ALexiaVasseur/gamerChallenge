import { Router } from "express";
import { router as challengeRouter } from "./challenge_router.js";
import { router as userRouter } from "./user_router.js";

export const router = Router();

router.use(userRouter);
router.use(challengeRouter)

router.use((req, res) => {
    res.status(404).json({ error: "Vérifiez le endpoint"});
});