import { Router } from "express";
import * as userController from "../controllers/user.controller.js";

export const router = Router();

router.post("/user", userController.createUser);