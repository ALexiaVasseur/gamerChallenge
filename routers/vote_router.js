import { Router } from "express";
import * as voteController from "../controllers/vote.controller.js";

export const router = Router();

router.get("/votes", voteController.getAllVotes);
router.post("/challenge/:idChallenge/participation/:idParticipation/vote", voteController.createVote);

router.patch("/challenge/:idChallenge/participation/:idParticipation/vote/:idvote", voteController.updateVote);