// controllers/chat.controller.js
import { Account } from "../models/index.js"; 
import { NotFoundError } from "../lib/errors.js";

// Vérifie si l'utilisateur est authentifié
export async function checkChatAuth(req, res) {
  const { userId } = req; // On suppose que l'id de l'utilisateur est déjà attaché à la requête via le middleware d'authentification
  const user = await Account.findOne({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError("Utilisateur non trouvé.");
  }

  res.status(200).json({ message: "Vous êtes authentifié et pouvez accéder au chat." });
}

// Exemple de route pour récupérer les messages de chat
export async function getMessages(req, res) {
  // Ici, tu peux récupérer les messages depuis une base de données
  const messages = []; // Remplace ceci par la logique pour récupérer les messages

  res.status(200).json({ messages }); // Retourne la liste des messages
}
