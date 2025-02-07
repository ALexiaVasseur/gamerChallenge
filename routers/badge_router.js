import { Router } from "express";
import * as badgeController from "../controllers/badge.controller.js";

export const router = Router();

router.get("/badges", badgeController.getAllBadges);
router.get("/badge/:id", badgeController.getOneBadge);