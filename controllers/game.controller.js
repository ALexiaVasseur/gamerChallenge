import { Game } from "../models/index.js"; // Adapte le chemin selon ta structure de dossiers
import { z } from "zod"; // Import de Zod
import { hash, compare, generateJwtToken, verifyJwtToken } from "../crypto.js";

// récupérer tous les challenges 
export async function getAllGames(req, res) {
    try {
        const games = await Game.findAll();
        res.status(200).json(games);

    }catch (error) {
  console.error("🔥 Erreur serveur:", error);
  res.status(500).json({ message: "Erreur interne du serveur." });
}
 
}

// recupérer un game

export async function getOneGame(req, res) {

  try {
    const game = await Game.findByPk(req.params.id);
    if(!game) return res.status(404).json({ message: "Game non trouvé."})
    res.status(200).json(game);

}catch (error) {
console.error("🔥 Erreur serveur:", error);
res.status(500).json({ message: "Erreur interne du serveur." });
}

}

// 🔹 Définition du schéma de validation avec Zod
const createGameBodySchema = z.object({
  id_igdb: z.number().int().min(0),
  title: z.string().min(1, "Le titre est requis."),
  description: z.string().min(1, "La description est requis."),  // Validation du titre (min 1 caractère)
  genre: z.string().min(1, "Le genre est requise."),  // Validation de la description
  url_video_game: z.string().url("L'URL vidéo est invalide.").optional(),
 
});



// créer un challenge 

export async function createOneGame(req, res){

  try {
    console.log("🛠 Requête reçue:", req.body);

    // 🔍 Validation avec safeParse()
    const result = createGameBodySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
    }

    const {id_igdb, title, description, genre,  url_video_game  } = result.data;

    const existingGame = await Game.findOne({ where: { title} });
    if (existingGame) {
        return res.status(400).json({ message: "Ce nom de déjà existe déjà" });
    }
    
   await Game.create({
    id_igdb,
    title,
    description,  // Validation du titre (min 1 caractère)
    genre,  // Validation de la description
    url_video_game,
    });

    res.status(201).json({
      message: "Game créé avec succès.",
    });
  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}


