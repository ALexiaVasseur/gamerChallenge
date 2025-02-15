import { Comment, Challenge } from "../models/index.js"; // Adapte le chemin selon ta structure de dossiers
import { z } from "zod"; // Import de Zod
import { hash, compare, generateJwtToken, verifyJwtToken } from "../crypto.js";

// récupérer tous les votes
export async function getAllComments(req, res) {
  try {
    // Récupère l'ID du challenge depuis la requête (paramètre ou query)
    const { challengeId } = req.query; // Utilise `challengeId` comme paramètre de requête
    
    if (!challengeId) {
      return res.status(400).json({ message: "L'ID du challenge est requis." });
    }

    // Trouve les commentaires pour ce challenge
    const comments = await Comment.findAll({
      where: { challenge_id: challengeId }, // Filtrer par `challenge_id`
    });

    if (!comments.length) {
      return res.status(404).json({ message: "Aucun commentaire trouvé pour ce challenge." });
    }

    // Retourne les commentaires associés au challenge
    res.status(200).json(comments);
  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}


// recupérer un vote

export async function getOneComment(req, res) {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if(!comment) return res.status(404).json({ message: "Commentaire non trouvé."})
    res.status(200).json(comment);
  }catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}


// créer une partitipation

const createCommentSchema = z.object({
  challenge_id: z.number().int().positive("L'ID du challenge doit être un entier positif."),
  account_id: z.number().int().positive("L'ID du compte doit être un entier positif."),
  text: z.string().min(1, "Le commentaire est requis.")
});

export async function createComment(req, res) {
  try {
    console.log("🛠 Requête reçue:", req.body);

    // Validation avec Zod
    const { success, data, error } = createCommentSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({ error: error.errors });
    }

    // ici
    const idChallenge = req.params.idChallenge;
    const challenge = await Challenge.findByPk(idChallenge);
    if(!challenge) return res.status(404).json({ message: "Challenge non trouvé."})


    // Création du vote
    await Comment.create({
      account_id: data.account_id,
      challenge_id: data.challenge_id,
      text: data.text
    });

    res.status(201).json({
      message: "Commentaire créé avec succès.",
    });

  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}




