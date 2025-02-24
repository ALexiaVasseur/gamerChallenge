import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
import { controllerWrapper as cw } from "./utils.js";

export const router = Router();

// Route to retrieve all categories
router.get("/categories", cw(categoryController.getAllCategories));

// Route to retrieve a specific category by its ID
router.get("/category/:id", cw(categoryController.getOneCategory));
