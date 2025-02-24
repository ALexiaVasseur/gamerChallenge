import { BadRequestError } from "../lib/errors.js";

// Game retrieval function
export const getGames = async (req, res) => {
  const response = await fetch('https://www.freetogame.com/api/games'); // Call to external API
  if (!response.ok) {
    throw new BadRequestError('Erreur lors de la récupération des jeux');
  }
  const data = await response.json();
  res.json(data);
};

