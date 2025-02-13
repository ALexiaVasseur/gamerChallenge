import { Router } from "express";
import * as badgeController from "../controllers/badge.controller.js";
import { controllerWrapper as cw } from "./utils.js";
export const router = Router();

router.get("/badges", cw(badgeController.getAllBadges));
router.get("/badge/:id", cw(badgeController.getOneBadge));