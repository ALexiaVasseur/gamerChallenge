import { Game } from "../models/index.js";
import { NotFoundError, BadRequestError } from "../lib/errors.js"
import { z } from "zod";

// recover all games
export async function getAllGames(req, res) {
  const games = await Game.findAll();
  res.status(200).json(games);
}

// recover a game
export async function getOneGame(req, res) {
  const game = await Game.findByPk(req.params.id);
  if (!game) throw new NotFoundError("Game not found."); 
  res.status(200).json(game);
}

const createGameBodySchema = z.object({
  thumbnail: z.string().min(1, "L'image est requise'."),
  title: z.string().min(1, "Le titre est requis."),
  description: z.string().min(1, "La description est requis."),
  genre: z.string().min(1, "Le genre est requise."),
  game_url: z.string().url("L'URL vidéo est invalide.").optional(),
 
});



// Create a game
export async function createOneGame(req, res){
  const result = createGameBodySchema.safeParse(req.body);
  if (!result.success) {
    throw new BadRequestError(result.error.format()); // Throwing a BadRequestError
  }

  const {thumbnail, title, description, genre,  game_url  } = result.data;

  const existingGame = await Game.findOne({ where: { title} });
  if (existingGame) {
    throw new BadRequestError("This game name already exists."); // Throwing a BadRequestError
  }
  
  await Game.create({
  thumbnail,
  title,
  description,
  genre,
  game_url,
  });

  res.status(201).json({
    message: "Game créé avec succès.",
  });
}


