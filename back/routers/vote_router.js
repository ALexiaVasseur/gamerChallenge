import { Router } from "express";
import * as voteController from "../controllers/vote.controller.js";
import { controllerWrapper as cw } from "./utils.js";
export const router = Router();

router.get("/votes", cw(voteController.getAllVotes));
router.post("/challenge/:idChallenge/participation/:idParticipation/vote", cw(voteController.createVote));

router.patch("/challenge/:idChallenge/participation/:idParticipation/vote/:idvote", cw(voteController.updateVote));