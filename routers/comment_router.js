import { Router } from "express";
import * as commentController from "../controllers/comment.controller.js";

export const router = Router();

router.get("/comments", commentController.getAllComments);
router.post("/challenge/:idChallenge/comment", commentController.createComment);

