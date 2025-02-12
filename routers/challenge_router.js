import { Router } from "express";
import * as challengeController from "../controllers/challenge.controller.js";
import { controllerWrapper as cw } from "./utils.js";
export const router = Router();

router.get("/challenges", cw(challengeController.getAllChallenges));
router.get("/sixChallenges", cw(challengeController.getLastSixChallenges));
router.get("/challenge/:id", cw(challengeController.getOneChallenge));
router.post("/challenge", cw(challengeController.createOneChallenge));
router.patch("/challenge/:id", cw(challengeController.updateChallenge));
router.delete("/challenge/:id", cw(challengeController.deleteChallenge));

router.get("/challenges/category/:type", cw(challengeController.getAllChallengesFromCategory));