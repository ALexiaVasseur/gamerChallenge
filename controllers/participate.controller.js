import { Challenge, Participate } from "../models/index.js"; // Adapte le chemin selon ta structure de dossiers
import { z } from "zod"; // Import de Zod
import { hash, compare, generateJwtToken, verifyJwtToken } from "../crypto.js";

// récupérer toutes les participations
export async function getAllParticipations(req, res) {
    try {
        const participations = await Participate.findAll();
        res.status(200).json(participations);
    }catch (error) {
        console.error("🔥 Erreur serveur:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
}


// créer une 
export const pariticipationSchema = z.object({
  challenge_id: z.number().int().positive(), // ID du challenge (entier positif)
  video_url: z.string().url().optional(), // URL de la vidéo (optionnel)
  image_url: z.string().url().optional(), // URL de l'image (optionnel)
  score: z.number().int().min(0).optional(), // Score (entier positif ou 0, optionnel)
  description: z.string().min(1, "La description est requise.") // Description obligatoire
});

export async function createParticipation(req, res) {
  try {
    console.log("🛠 Requête reçue:", req.body);

    // Validation avec Zod
    const { challenge_id, video_url, image_url,score, description} = createParticipation.safeParse(req.body);

    if (!success) {
      return res.status(400).json({ error: error.errors });
    }

    const idChallenge = req.params.idChallenge;
    const challenge = await Challenge.findByPk(idChallenge);
    if(!challenge) return res.status(404).json({ message: "Challenge non trouvé."})


    // Création de la participation
    await Participate.create({
      challenge_id: data.challenge_id,
      video_url: data.video_url,
      image_url: data.image_url,
      score: data.score,
      description: data.description
    });

    res.status(201).json({
      message: "Pariticipation créée avec succès.",
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




