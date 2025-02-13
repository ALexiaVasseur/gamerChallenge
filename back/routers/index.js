import { Router } from "express"; 
import { router as challengeRouter } from "./challenge_router.js";
import { router as userRouter } from "./user_router.js";
import { router as voteRouter } from "./vote_router.js"; 
import { router as participateRouter } from "./participate_router.js"; 
import { router as gameRouter } from "./game_router.js"; 
import { router as commentRouter } from "./comment_router.js"; 
import { router as badgeRouter } from "./badge_router.js"; 

export const router = Router();

// Utilisation des routers
router.use(userRouter);
router.use(challengeRouter);
router.use(voteRouter);
router.use(participateRouter);
router.use(gameRouter);
router.use(commentRouter);
router.use(badgeRouter);

// Gestion des erreurs 404
router.use((req, res) => {
    res.status(404).json({ error: "Vérifiez le endpoint" });
});
