import { Challenge, Participate, Account, Vote} from "../models/index.js"; // Adapte le chemin selon ta structure de dossiers
import { z } from "zod"; // Import de Zod
import { hash, compare, generateJwtToken, verifyJwtToken } from "../crypto.js";
import { givePoint } from "../lib/voteGive.js";

// Schema de validation Zod pour la participation
export const participationSchema = z.object({
  challenge_id: z.number().int().positive(), // ID du challenge (entier positif)
  video_url: z.string().url().optional(), // URL de la vidéo (optionnel)
  image_url: z.string().url().optional(), // URL de l'image (optionnel)
  score: z.number().int().min(0).optional(), // Score (entier positif ou 0, optionnel)
  description: z.string().min(1, "La description est requise."), // Description obligatoire
  account_id: z.number().int()
});

// Controller pour récupérer les participations d'un challenge
export const getParticipationsForChallenge = async (req, res) => {
  try {
    const challengeId = req.params.idChallenge;

    // Récupération des participations avec les comptes et votes associés
    const participations = await Participate.findAll({
      where: { challenge_id: challengeId },
      include: [
        {
          model: Account,
          as: 'account',
          attributes: ['pseudo', "score_global"]
        },
        {
          model: Vote,
          as: 'votes',
          attributes: ['vote', 'account_id']
        }
      ],
      attributes: ['id', 'video_url', 'image_url', 'description', 'score']
    });

    console.log("🔍 Participations trouvées (avant transformation) :", participations);

    if (!participations || participations.length === 0) {
      return res.status(404).json({ message: "Aucune participation trouvée pour ce challenge." });
    }

    // Extraction des valeurs pour éviter le format Sequelize
    const formattedParticipations = participations.map(participation => ({
      ...participation.dataValues,
      account: participation.account ? participation.account.dataValues : null,
      votes: participation.votes ? participation.votes.map(vote => vote.dataValues) : []
    }));

    console.log("✅ Participations envoyées :", formattedParticipations);

    res.status(200).json(formattedParticipations);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des participations:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};


export const getAllVotesForChallenge = async (req, res) => {
  try {
    const { idChallenge } = req.params;

    // Vérifier si le challenge existe
    const challenge = await Challenge.findByPk(idChallenge);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge non trouvé" });
    }

    // Récupérer tous les votes des participations du challenge
    const votes = await Vote.findAll({
      include: [
        {
          model: Participate,
          as: "participate",
          where: { challenge_id: idChallenge },  // Filtrer par challenge_id
          attributes: ["id"],  // Nous ne voulons que l'ID de la participation
        },
        {
          model: Account,  // Ajouter des informations sur l'utilisateur qui a voté
          as: "account",
          attributes: ["id", "pseudo", "score_global"],  // Mettre les informations du compte
        }
      ],
      attributes: ["account_id", "participation_id", "vote"],  // Récupérer les attributs des votes
    });

    if (votes.length === 0) {
      return res.status(404).json({ message: "Aucun vote trouvé pour ce challenge" });
    }

    // Retourner les votes
    res.status(200).json(votes);
  } catch (error) {
    console.error("Erreur lors de la récupération des votes :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};




// Récupérer toutes les participations
export async function getAllParticipations(req, res) {
    try {
        const participations = await Participate.findAll();
        res.status(200).json(participations);
    } catch (error) {
        console.error("🔥 Erreur serveur:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
}

// Créer une participation
export async function createParticipation(req, res) {
  try {
    console.log("🛠 Requête reçue:", req.body);

    // Validation des données avec Zod (ou autre librairie)
    const result = participationSchema.safeParse(req.body);

    if (!result.success) {
      console.error("Validation échouée:", result.error.errors);
      return res.status(400).json({ error: result.error.errors }); // Renvoie un message d'erreur détaillé
    }

    // Destructuration des données validées
    const { challenge_id, video_url, image_url, score, description, account_id } = result.data;

    // Vérification que le challenge existe dans la base de données
    const challenge = await Challenge.findByPk(challenge_id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge non trouvé." });
    }
  
    // Vérification que l'utilisateur existe
    console.log(account_id)
    const account = await Account.findByPk(account_id);
    if (!account) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Création de la participation
    const participation = await Participate.create({
      challenge_id,
      account_id,
      video_url,
      image_url,
      score,
      description,
    });
    console.log("challenge account : ", challenge.account_id)

    console.log("Participation créée avec succès:", participation);

// Récupération de la participation avec l'account associé pour inclure le pseudo
const participationWithUser = await Participate.findByPk(participation.id, {
  include: {
    model: Account,
    as: "account",
    attributes: ["pseudo", "score_global"], // On ne récupère que le pseudo
  },
});

    // Renvoie la participation avec le pseudo de l'utilisateur
    return res.status(201).json({
      message: "Participation créée avec succès.",
      participation: participationWithUser, // Inclut le pseudo de l'utilisateur
    });

  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
}



// export async function deleteParticipation(req,res) {
//   // Récupérer l'ID de la carte à supprimer
//   const challengeId = parseInt(req.params.id);

//   // récupérer la carte à supprimer
//   const challenge = await Challenge.findByPk(challengeId);
  
//   // Si pas de carte => 404
//   if (!challenge) {
//     return res.status(404).json({ error: "Challenge not found. Please verify the provided id." });
//   }

//   // Sinon, on supprime
//   await challenge.destroy();

//   // Renvoyer un body vide
//   res.status(204).end();

// }




