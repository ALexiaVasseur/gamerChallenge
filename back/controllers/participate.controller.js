import { Challenge, Participate, Account} from "../models/index.js"; // Adapte le chemin selon ta structure de dossiers
import { z } from "zod"; // Import de Zod
import { hash, compare, generateJwtToken, verifyJwtToken } from "../crypto.js";

// Schema de validation Zod pour la participation
export const participationSchema = z.object({
  challenge_id: z.number().int().positive(), // ID du challenge (entier positif)
  video_url: z.string().url().optional(), // URL de la vidéo (optionnel)
  image_url: z.string().url().optional(), // URL de l'image (optionnel)
  score: z.number().int().min(0).optional(), // Score (entier positif ou 0, optionnel)
  description: z.string().min(1, "La description est requise.") // Description obligatoire
});

// Controller pour récupérer les participations d'un challenge
export const getParticipationsForChallenge = async (req, res) => {
  try {
    const challengeId = req.params.idChallenge;

    // On cherche toutes les participations associées à ce challenge
    const participations = await Participate.findAll({
      where: { challenge_id: challengeId },
      include: [
        {
          model: Account, // Inclure le modèle Account pour récupérer les informations des participants
          as: 'account', // Assurez-vous que le modèle est bien lié dans votre association
          attributes: ['pseudo'] // Ici, on inclut juste le pseudo de l'utilisateur, mais vous pouvez ajouter plus d'attributs
        }
      ],
      attributes: ['id', 'video_url', 'image_url', 'description', 'score'] // Sélectionner les attributs de Participation
    });

    if (!participations || participations.length === 0) {
      return res.status(404).json({ message: "Aucune participation trouvée pour ce challenge." });
    }

    res.status(200).json(participations);
  } catch (error) {
    console.error("Erreur lors de la récupération des participations:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
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

    // Validation avec Zod
    const result = participationSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    // Destructurer les données validées
    const { challenge_id, video_url, image_url, score, description } = result.data;

    // Récupérer le challenge par ID
    const challenge = await Challenge.findByPk(challenge_id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge non trouvé." });
    }

    // Création de la participation
    await Participate.create({
      challenge_id,
      video_url,
      image_url,
      score,
      description
    });

    res.status(201).json({
      message: "Participation créée avec succès.",
    });

  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
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




