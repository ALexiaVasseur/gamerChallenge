import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { controllerWrapper as cw } from "./utils.js";
export const router = Router();


router.get("/user/:id", cw(userController.getOneUser))
router.post("/auth/signup", cw(userController.signupUser));
router.post("/auth/login", cw(userController.loginUser));
router.post("/auth/logout", cw(userController.logoutUser));