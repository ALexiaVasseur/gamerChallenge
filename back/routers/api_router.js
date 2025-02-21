// routes/gameRoutes.js
import { Router } from "express";
import * as apiGameController from "../controllers/apiGame.controller.js";// Assurez-vous d'inclure .js dans l'import


export const router = Router();

// Définir la route pour récupérer les jeux
router.get('/freetogames', apiGameController.getGames);


