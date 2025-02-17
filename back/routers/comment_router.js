import { Router } from "express";
import * as commentController from "../controllers/comment.controller.js";
import { controllerWrapper as cw } from "./utils.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js"; // Assurez-vous d'importer le middleware

export const router = Router();

router.get("/comments", cw(commentController.getAllComments));
router.get('/challenges/:challengeId/comments', commentController.getCommentsForChallenge);

router.post("/challenge/:idChallenge/comment", isAuthenticated, cw(commentController.createComment));

