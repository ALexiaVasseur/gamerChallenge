import { Challenge, Participate, Account, Vote} from "../models/index.js";
import { NotFoundError, BadRequestError } from "../lib/errors.js"
import { z } from "zod";


export const participationSchema = z.object({
  challenge_id: z.number().int().positive(),
  video_url: z.string().url().optional(),
  image_url: z.string().url().optional(), 
  score: z.number().int().min(0).optional(),
  description: z.string().min(1, "La description est requise."),
  account_id: z.number().int()
});

// retrieve all the participations in a challenge
export const getParticipationsForChallenge = async (req, res) => {
  const challengeId = req.params.idChallenge;

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

  if (!participations || participations.length === 0) {
    throw new NotFoundError("Aucune participation trouvé pour ce challenge."); 
  }

  const formattedParticipations = participations.map(participation => ({
    ...participation.dataValues,
    account: participation.account ? participation.account.dataValues : null,
    votes: participation.votes ? participation.votes.map(vote => vote.dataValues) : []
  }));

  res.status(200).json(formattedParticipations);
};

// retrieve all the votes in a challenge
export const getAllVotesForChallenge = async (req, res) => {
  const { idChallenge } = req.params;

  const challenge = await Challenge.findByPk(idChallenge);
  if (!challenge) {
    throw new NotFoundError("Challenge not found."); 
  }


  const votes = await Vote.findAll({
    include: [
      {
        model: Participate,
        as: "participate",
        where: { challenge_id: idChallenge }, 
        attributes: ["id"],  
      },
      {
        model: Account, 
        as: "account",
        attributes: ["id", "pseudo", "score_global"], 
      }
    ],
    attributes: ["account_id", "participation_id", "vote"], 
  });

  if (votes.length === 0) {
    throw new NotFoundError("No votes found for this challenge."); 
  }

  res.status(200).json(votes);
};




// Recover all participations
export async function getAllParticipations(req, res) {
  const participations = await Participate.findAll();
  res.status(200).json(participations);
}

// Create a participation
export async function createParticipation(req, res) {
  const result = participationSchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError(result.error.format()); 
  }

  const { challenge_id, video_url, image_url, score, description, account_id } = result.data;

  const challenge = await Challenge.findByPk(challenge_id);
  if (!challenge) {
    throw new NotFoundError("Challenge non trouvé."); 
  }

  const account = await Account.findByPk(account_id);
  if (!account) {
    throw new NotFoundError("Utilisateur non trouvé."); 
  }

  const participation = await Participate.create({
    challenge_id,
    account_id,
    video_url,
    image_url,
    score,
    description,
  });

  const participationWithUser = await Participate.findByPk(participation.id, {
    include: {
      model: Account,
      as: "account",
      attributes: ["pseudo", "score_global"], 
    },
  });

  return res.status(201).json({
    message: "Participation créée avec succès.",
    participation: participationWithUser,
  });
}

