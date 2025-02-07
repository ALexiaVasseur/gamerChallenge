import { Router } from "express";
import * as challengeController from "../controllers/challenge.controller.js";

export const router = Router();

router.get("/challenges", challengeController.getAllChallenges);
router.get("/challenge/:id", challengeController.getOneChallenge);
router.post("/challenge", challengeController.createOneChallenge);
router.patch("/challenge/:id", challengeController.updateChallenge);
router.delete("/challenge/:id", challengeController.deleteChallenge);