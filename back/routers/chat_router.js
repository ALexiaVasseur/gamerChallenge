import express from 'express';
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import * as chatController from "../controllers/chat.controller.js";

const router = express.Router();

// Route pour vérifier si l'utilisateur est authentifié
router.get('/chat', isAuthenticated, chatController.checkChatAuth); // Assurez-vous que cette route existe

// Route pour récupérer les messages de chat
router.get('/messages', isAuthenticated, chatController.getMessages);

export { router };
