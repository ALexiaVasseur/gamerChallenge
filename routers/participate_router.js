import { Router } from "express";
import * as participateController from "../controllers/participate.controller.js";

export const router = Router();


router.get("/participations", participateController.getAllParticipations);
router.post("/challenge/:idChallenge/participations", participateController.createParticipation);
