import { Challenge, Account, Comment, Participate, Vote, Game, Category } from "../models/index.js"; 
import { NotFoundError} from "../lib/errors.js"
import { z } from "zod"; // Import Zod

// Get challenges 
export async function getAllChallenges(req, res) {
  const challenges = await Challenge.findAll({
    include: [
      {
        model: Category,  
        as: 'category',  
        attributes: ['id', 'name', 'description'], 
      },
    ],
  });

  res.status(200).json(challenges);
}

// Get six challenges for homePage
export async function getLastSixChallenges(req, res) {
 
    const challenges = await Challenge.findAll({
      order: [['created_at', 'DESC']],
      limit: 6,
      include: [
        {
          model: Account, 
          as: "account",
          attributes: ["id", "pseudo"] 
        }
      ]
    });

    if (!challenges.length) {
      throw new NotFoundError("Aucun challenge trouvé.");
    }
  
    res.status(200).json(challenges);
  }


// Get One challenge

export async function getOneChallenge(req, res) {
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
        model: Category, 
        as: 'category',
        attributes: ['id', 'name', 'description'],
      },
    ],
  });

  if (!challenge) {
    throw new NotFoundError("Challenge non trouvé.");
  }

  res.status(200).json(challenge);
}



// schéma Zod for create one challenge
const createChallengeBodySchema = z.object({
  game_id: z.number().int().min(0),
  title: z.string().min(1, "Le titre est requis."),
  description: z.string().min(1, "La description est requise."),
  rules: z.string().min(0),
  image_url: z.string().url("L'URL de l'image est invalide.").optional(),
  account_id: z.number().int().min(0, "L'identifiant du compte est requis."),
  category_id: z.coerce.number().int().min(1, "L'identifiant de la catégorie est requis."),
});


// schéma Zod for update one challenge
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

// Create One challenge 
export async function createOneChallenge(req, res) {
    const { game_id, title, description, rules, image_url, account_id, type, category_id, video_url } = req.body;

    //  Check if the game exists
    let existingGame = await Game.findByPk(game_id);

    // if game no exists get with external API 
    if (!existingGame) {
      const externalResponse = await fetch(`https://www.freetogame.com/api/game?id=${data.game_id}`);
      if (!externalResponse.ok) {
        throw new NotFoundError("Jeu introuvable dans l'API externe.");
      }

      const gameData = await externalResponse.json();

      //  push game on the BDD 
      existingGame = await Game.create({
        id: gameData.id,
        title: gameData.title,
        genre: gameData.genre,
        url_video_game: video_url, 
      });
    }

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

    return res.status(201).json(challenge);
}



// Update One challenge

export async function updateChallenge(req,res) {
  const challengeId= parseInt(req.params.id)

  const challenge = await Challenge.findByPk(challengeId);

  if (!challenge) {
    throw new NotFoundError("Challenge non trouvé.");
  }

  const body = req.body;

 // validate with zod
  const { error, data } = updateChallengeBodySchema.safeParse(body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Update all fields
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

// Delete One challenge
export async function deleteChallenge(req,res) {
  
  const challengeId = parseInt(req.params.id);

  // Get the card to be deleted
  const challenge = await Challenge.findByPk(challengeId);
  // if no card => 404
  if (!challenge) {
    throw new NotFoundError("Challenge non trouvé.");
  }
  // or , delete
  await challenge.destroy();
  res.status(204).end();

}

//Get all challenges from their category
export async function getAllChallengesFromCategory(req, res) {
  const challengeType = req.params.type;
  const challenges = await Challenge.findAll( { where : {type: challengeType}})

  if (!challenges.length) {
    throw new NotFoundError("Aucun challenge trouvé.");
  }

  res.status(200).json(challenges);
}
