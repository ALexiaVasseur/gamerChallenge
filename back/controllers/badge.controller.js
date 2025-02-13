import { Badge } from "../models/index.js"; // Adapte le chemin selon ta structure de dossiers
import { z } from "zod"; // Import de Zod
import { hash, compare, generateJwtToken, verifyJwtToken } from "../crypto.js";

// récupérer tous les challenges 
export async function getAllBadges(req, res) {
    try {
        const badges = await Badge.findAll();
        res.status(200).json(badges);

    }catch (error) {
  console.error("🔥 Erreur serveur:", error);
  res.status(500).json({ message: "Erreur interne du serveur." });
}
 
}

// recupérer un game

export async function getOneBadge(req, res) {

  try {
    const badge = await Badge.findByPk(req.params.id);
    if(!badge) return res.status(404).json({ message: "Badge non trouvé."})
    res.status(200).json(badge);

}catch (error) {
console.error("🔥 Erreur serveur:", error);
res.status(500).json({ message: "Erreur interne du serveur." });
}

}



