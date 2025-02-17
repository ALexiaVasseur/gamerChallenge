import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";

export const router = Router();

// Route pour récupérer toutes les catégories
router.get("/categories", categoryController.getAllCategories);

// Route pour récupérer une catégorie spécifique par son ID
router.get("/category/:id", categoryController.getOneCategory);
