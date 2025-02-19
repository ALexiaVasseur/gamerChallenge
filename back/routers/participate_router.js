import { Router } from "express";
import * as participateController from "../controllers/participate.controller.js";
import { controllerWrapper as cw } from "./utils.js";
export const router = Router();


router.get("/participations", cw(participateController.getAllParticipations));
router.get("/challenge/:idChallenge/votes",cw(participateController.getAllVotesForChallenge));
router.post("/challenge/:idChallenge/participations", cw(participateController.createParticipation));
router.get("/participations/:idChallenge", cw(participateController.getParticipationsForChallenge));

