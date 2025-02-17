import { Comment, Challenge, Account } from "../models/index.js"; // Adapte le chemin selon ta structure de dossiers
import { z } from "zod"; // Import de Zod
import { hash, compare, generateJwtToken, verifyJwtToken } from "../crypto.js";

// récupérer tous les votes
// récupérer tous les commentaires
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        {
          model: Account,
          as: 'account', // Utiliser l'alias défini
          attributes: ['pseudo'], // Inclure uniquement le pseudo pour alléger la réponse
        },
        {
          model: Challenge,
          as: 'challenge', // Inclure le challenge lié
          attributes: ['title'], // Inclure le titre du challenge par exemple
        }
      ],
    });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des commentaires.' });
  }
};




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
  text: z.string().min(1, "Le commentaire est requis.")
});

export async function createComment(req, res) {
  try {
    console.log("🛠 Requête reçue:", req.body);
    console.log("Utilisateur connecté ID:", req.userId); // Vérifier ici

    // Validation avec Zod
    const { success, data, error } = createCommentSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: error.errors });
    }

    const { challenge_id, text } = data;
    const account_id = req.userId; // Utilisez l'ID de l'utilisateur authentifié

    if (!account_id) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    // Vérification de l'existence du challenge
    const challenge = await Challenge.findByPk(challenge_id);
    if (!challenge) return res.status(404).json({ message: "Challenge non trouvé." });

    // Vérification de l'existence du compte
    const account = await Account.findByPk(account_id);
    if (!account) return res.status(404).json({ message: "Compte non trouvé." });

    // Vérification si le commentaire existe déjà pour ce challenge par cet utilisateur
    const existingComment = await Comment.findOne({
      where: {
        challenge_id: challenge_id,
        account_id: account_id
      }
    });

    if (existingComment) {
      return res.status(400).json({ message: "Vous avez déjà commenté ce défi." });
    }

    // Création du commentaire
    const newComment = await Comment.create({
      account_id,
      challenge_id,
      text,
    });

    // Inclure le pseudo dans la réponse
    const commentResponse = {
      id: newComment.id,
      account_id: newComment.account_id,
      challenge_id: newComment.challenge_id,
      text: newComment.text,
      created_at: newComment.createdAt,
      updated_at: newComment.updatedAt,
      account: {
        pseudo: account.pseudo
      }
    };

    res.status(201).json(commentResponse);
  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}


// Fonction pour récupérer les commentaires d'un challenge spécifique
export const getCommentsForChallenge = async (req, res) => {
  const { challengeId } = req.params; // Récupérer l'ID du challenge depuis les paramètres de la requête

  try {
    // Trouver les commentaires pour le challenge spécifié
    const comments = await Comment.findAll({
      where: { challenge_id: challengeId }, // Filtrer par challenge_id
      include: [
        {
          model: Account,
          as: 'account', // Utiliser l'alias défini
          attributes: ['pseudo'], // Inclure uniquement le pseudo
        }
      ],
    });

    // Vérifier si des commentaires ont été trouvés
    if (comments.length === 0) {
      return res.status(404).json({ message: 'Aucun commentaire trouvé pour ce challenge.' });
    }

    res.json(comments); // Retourner les commentaires
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des commentaires.' });
  }
};

