import { Router } from "express";
import * as gameController from "../controllers/game.controller.js";
import { controllerWrapper as cw } from "./utils.js";
export const router = Router();

router.get("/games", cw(gameController.getAllGames));
router.post("/game", cw(gameController.createOneGame));