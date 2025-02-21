import { Challenge, Account, Comment, Participate, Vote, Game, Category } from "../models/index.js"; // Adapte le chemin selon ta structure de dossiers
import { z } from "zod"; // Import de Zod
import { hash, compare, generateJwtToken, verifyJwtToken } from "../crypto.js";

// récupérer tous les challenges 
export async function getAllChallenges(req, res) {
  try {
    const challenges = await Challenge.findAll({
      include: [
        {
          model: Category,  // Inclure la catégorie
          as: 'category',   // Le nom de l'association
          attributes: ['id', 'name', 'description'], // Les champs à récupérer
        },
      ],
    });

    res.status(200).json(challenges);
  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}

export async function getLastSixChallenges(req, res) {
  try {
    const challenges = await Challenge.findAll({
      order: [['created_at', 'DESC']],
      limit: 6,
      include: [
        {
          model: Account, //  Associe le modèle Account
          as: "account", //  Assurez-vous que l'association est bien nommée
          attributes: ["id", "pseudo"] // 🔥 Sélectionne uniquement "id" et "name"
        }
      ]
    });

    if (!challenges.length) {
      return res.status(404).json({ message: "Aucun challenge trouvé." });
    }

    res.status(200).json(challenges);
  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}

// recupérer un challenge

export async function getOneChallenge(req, res) {
  try {
    const challenge = await Challenge.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          as: "comments",
          include: [{ model: Account, as: "account", attributes: ["id", "pseudo"] }],
        },
        {
          model: Participate,
          as: "participations",
          include: [
            { model: Account, as: "account", attributes: ["id", "pseudo"] },
            {
              model: Vote,
              as: "votes",
              include: [{ model: Account, as: "account", attributes: ["id", "pseudo"] }],
            },
          ],
        },
        {
          model: Account,
          as: "account",
          attributes: ["id", "pseudo", "email"],
        },
        {
          model: Game,
          as: "game",
          attributes: ["id_igdb", "title", "description", "genre", "url_video_game"],
        },
        {
          model: Category,  // Inclure la catégorie
          as: 'category',
          attributes: ['id', 'name', 'description'],
        },
      ],
    });

    if (!challenge) {
      return res.status(404).json({ message: "Challenge non trouvé." });
    }

    res.status(200).json(challenge);
  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}



// Définition du schéma de validation avec Zod pour la création d'un challenge
const createChallengeBodySchema = z.object({
  game_id: z.number().int().min(0),
  title: z.string().min(1, "Le titre est requis."),
  description: z.string().min(1, "La description est requise."),
  rules: z.string().min(0),
  // Vous pouvez retirer "type" du schéma si vous ne le souhaitez pas,
  // mais dans ce cas, vous devez l'ajouter manuellement dans votre code.
  image_url: z.string().url("L'URL de l'image est invalide.").optional(),
  account_id: z.number().int().min(0, "L'identifiant du compte est requis."),
  category_id: z.coerce.number().int().min(1, "L'identifiant de la catégorie est requis."),
});


// Définition du schéma de validation pour la mise à jour d'un challenge
const updateChallengeBodySchema = z.object({
  game_id: z.number().int().min(0),
  title: z.string().min(1, "Le titre est requis."),
  description: z.string().min(1, "La description est requise."),
  rules: z.string().min(0),
  image_url: z.string().url("L'URL de l'image est invalide.").optional(),
  category_id: z.number().int().min(1, "L'identifiant de la catégorie est requis."), // Ajout de category_id
  account_id: z.number().int().min(0),
  type: z.string().min(0).optional(),
  video_url: z.string().url("L'URL de la vidéo est invalide.")
});

// créer un challenge 

export async function createOneChallenge(req, res) {
  try {
    console.log("🛠 Requête reçue:", req.body);

    const { game_id, title, description, rules, image_url, account_id, type, category_id, video_url } = req.body;

    // 🔍 Vérifier si le jeu existe en interne
    let existingGame = await Game.findByPk(game_id);

    // 🛠 Si le jeu n'existe pas en interne, récupérer depuis l'API externe
    if (!existingGame) {
      console.log(`🔍 Le jeu ${game_id} n'est pas en base de données, récupération depuis l'API externe...`);

      try {
        const externalResponse = await fetch(`https://www.freetogame.com/api/game?id=${game_id}`);
        
        if (!externalResponse.ok) {
          return res.status(404).json({ error: "Jeu introuvable dans l'API externe" });
        }

        const gameData = await externalResponse.json();

        console.log(video_url)
        // 🎮 Ajouter le jeu dans la base de données interne
        existingGame = await Game.create({
          id: gameData.id,
          title: gameData.title,
          genre: gameData.genre,
          url_video_game: video_url, 
          // Assure-toi que la colonne existe dans ta BDD
        });

        console.log(`✅ Jeu ${game_id} ajouté en base de données`);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération du jeu depuis l'API externe :", error);
        return res.status(500).json({ error: "Erreur lors de la récupération du jeu" });
      }
    }

    // ✅ Création du challenge après vérification du jeu
    const challenge = await Challenge.create({
      game_id,
      title,
      description,
      rules,
      type,
      image_url,
      account_id,
      category_id,
    });

    console.log(`🎉 Challenge créé avec succès pour le jeu ${game_id}`);
    return res.status(201).json(challenge);

  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    return res.status(500).json({ error: "Erreur serveur" });
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

export async function getAllChallengesFromCategory(req, res) {
  try {
    const challengeType = req.params.type;
    const challenges = await Challenge.findAll( { where : {type: challengeType}})

    if (!challenges.length) {
      return res.status(404).json({ message: "Aucun challenge trouvé." });
    }

    res.status(200).json(challenges);
  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}
