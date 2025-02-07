import { Router } from "express";
import * as gameController from "../controllers/game.controller.js";

export const router = Router();

router.get("/games", gameController.getAllGames);
router.post("/game", gameController.createOneGame);