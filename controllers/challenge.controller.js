import { Challenge } from "../models/index.js"; // Adapte le chemin selon ta structure de dossiers
import { z } from "zod"; // Import de Zod
import { hash, compare, generateJwtToken, verifyJwtToken } from "../crypto.js";

// récupérer tous les challenges 
export async function getAllChallenges(req, res) {
    try {
        const challenges = await Challenge.findAll();
        res.status(200).json(challenges);

    }catch (error) {
  console.error("🔥 Erreur serveur:", error);
  res.status(500).json({ message: "Erreur interne du serveur." });
}
 
}

// recupérer un challenge

export async function getOneChallenge(req, res) {

  try {
    const challenge = await Challenge.findByPk(req.params.id);
    if(!challenge) return res.status(404).json({ message: "Challenge non trouvé."})
    res.status(200).json(challenge);

}catch (error) {
console.error("🔥 Erreur serveur:", error);
res.status(500).json({ message: "Erreur interne du serveur." });
}

}

// 🔹 Définition du schéma de validation avec Zod
const createChallengeBodySchema = z.object({
  game_id: z.number().int().min(0),
  title: z.string().min(1, "Le titre est requis."),  // Validation du titre (min 1 caractère)
  description: z.string().min(1, "La description est requise."),  // Validation de la description
  rules: z.string().min(0),  // Validation des règles
  type: z.string().min(1, "Le type est requis."),  // Validation du type (min 1 caractère)
  video_url: z.string().url("L'URL vidéo est invalide.").optional(),  // URL vidéo, optionnelle, valide si présente
  account_id: z.string().min(1, "L'identifiant du compte est requis."),  // Validation de l'account_id (min 1 caractère)
});

// 🔹 Définition du schéma de validation avec Zod
const updateChallengeBodySchema = z.object({
  game_id: z.number().int().min(0),
  title: z.string().min(1, "Le titre est requis."),  // Validation du titre (min 1 caractère)
  description: z.string().min(1, "La description est requise."),  // Validation de la description
  rules: z.string().min(0),  // Validation des règles
  type: z.string().min(1, "Le type est requis."),  // Validation du type (min 1 caractère)
  video_url: z.string().url("L'URL vidéo est invalide.").optional()  // URL vidéo, optionnelle, valide si présente
});


// créer un challenge 

export async function createOneChallenge(req, res){

  try {
    console.log("🛠 Requête reçue:", req.body);

    // 🔍 Validation avec safeParse()
    const result = createChallengeBodySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
    }

    const { game_id, title, description, rules, type, video_url, account_id  } = result.data;

    const existingChallenge = await Challenge.findOne({ where: { title } });
    if (existingChallenge) {
        return res.status(400).json({ message: "Ce nom de déjà existe déjà" });
    }
    
   await Challenge.create({
      game_id,
      title,
      description,
      rules,
      type,
      video_url,
      account_id
    });

    res.status(201).json({
      message: "Challenge créé avec succès.",
    });
  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}

// mettre à jour un challenge

export async function updateChallenge(req,res) {
  const challengeId= parseInt(req.params.id)

  const challenge = await Challenge.findByPk(challengeId);

  if (!challenge) {
    return res.status(404).json({ error: "Challenge not found. Please verify the provided id." })
  }

  const body = req.body;

 // Valider le body
  const { error, data } = updateChallengeBodySchema.safeParse(body);
  // Si error => 400
  if (error) {
    return res.status(400).json({ error: error.message });
  }


  // Procéder à l'update
  challenge.title = data.title || challenge.title;
  challenge.description = data.description || challenge.description;
  challenge.rules = data.rules || challenge.rules;
  challenge.type = data.type || challenge.type;
  challenge.video_url = data.video_url || challenge.video_url;
  challenge.account_id = data.account_id || challenge.account_id;
  challenge.game_id = data.game_id || challenge.game_id;
  await challenge.save();

  res.json(challenge)
}


export async function deleteChallenge(req,res) {
  // Récupérer l'ID de la carte à supprimer
  const challengeId = parseInt(req.params.id);

  // récupérer la carte à supprimer
  const challenge = await Challenge.findByPk(challengeId);
  
  // Si pas de carte => 404
  if (!challenge) {
    return res.status(404).json({ error: "Challenge not found. Please verify the provided id." });
  }

  // Sinon, on supprime
  await challenge.destroy();

  // Renvoyer un body vide
  res.status(204).end();

}
