import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { controllerWrapper as cw } from "./utils.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

export const router = Router();


router.get("/user/:id", cw(userController.getOneUser))
router.patch("/user/:userId", isAuthenticated, cw(userController.updateUser));
router.patch("/user/:userId/updateScore", isAuthenticated,cw(userController.updateScore));

router.post("/auth/signup", cw(userController.signupUser));
router.post("/auth/login", cw(userController.loginUser));
router.post("/auth/logout", cw(userController.logoutUser));

router.get("/auth/check", isAuthenticated, cw(userController.checkUser));


router.get("/leaderboard", cw(userController.getLeaderboard));

router.delete("/user/:userId", isAuthenticated, cw(userController.deleteUser));
