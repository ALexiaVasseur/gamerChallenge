import { Router } from "express";
import * as userController from "../controllers/user.controller.js";

export const router = Router();

router.post("/auth/signup", userController.signupUser);
router.post("/auth/login", userController.loginUser);
router.post("/auth/logout", userController.logoutUser);