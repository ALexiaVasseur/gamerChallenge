import { Router } from "express";
import { controllerWrapper as cw } from "./utils.js";
import * as apiGameController from "../controllers/apiGame.controller.js";


export const router = Router();

router.get('/freetogames', cw(apiGameController.getGames));


