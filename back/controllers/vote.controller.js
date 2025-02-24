import { Challenge, Participate, Vote } from "../models/index.js";
import { NotFoundError, BadRequestError } from "../lib/errors.js"
import { z } from "zod"; 

// Recover all votes
export async function getAllVotes(req, res) {
  const votes = await Vote.findAll();
  res.status(200).json(votes);
}

// Recover a vote
export async function getOneVote(req, res) {
  const vote = await Vote.findByPk(req.params.id);
  if (!vote) {
    throw new NotFoundError("Vote non trouvé."); 
  }
  res.status(200).json(vote);
}

const createVoteSchema = z.object({
  account_id: z.number().int().positive("L'ID du compte doit être un entier positif."),
  participation_id: z.number().int().positive("L'ID de participation doit être un entier positif."),
  vote: z.number().int().min(1).max(5),
});

// Create a vote
export async function createVote(req, res) {
  const { success, data, error } = createVoteSchema.safeParse(req.body);

  if (!success) {
    console.error("❌ Erreur de validation:", error.errors);
    throw new BadRequestError("Validation error: " + JSON.stringify(error.errors)); 
  }

  const idChallenge = Number(req.params.idChallenge);
  const idParticipation = Number(req.params.idParticipation);

  if (isNaN(idChallenge) || isNaN(idParticipation)) {
    throw new BadRequestError("Challenge ou Participation ID invalide."); 
  }

  const challenge = await Challenge.findByPk(idChallenge);
  if (!challenge) {
    console.error("❌ Challenge non trouvé:", idChallenge);
    throw new NotFoundError("Challenge not found."); 
  }

  const participation = await Participate.findByPk(idParticipation);
  if (!participation) {
    console.error("❌ Participation non trouvée:", idParticipation);
    throw new NotFoundError("Participation not found."); 
  }

  const newVote = await Vote.create({
    account_id: data.account_id,
    participation_id: idParticipation, 
    vote: data.vote
  });
  res.status(201).json({ message: "Vote créé avec succès." });
}

// Update a vote
export async function updateVote(req,res) {
  const challengeId = parseInt(req.params.idChallenge)
  const participationId = parseInt(req.params.idParticipation)
  const voteId = parseInt(req.params.idvote)

  const challenge = await Challenge.findByPk(challengeId);
  if (!challenge) {
    throw new NotFoundError("Challenge not found."); 
  }

  const participation = await Participate.findByPk(participationId);
  if (!participation) {
    throw new NotFoundError("Participation non trouvée."); 
  }
    
  const vote = await Vote.findByPk(voteId);

  if (!vote) {
    throw new NotFoundError("Vote non trouvé. Veuillez vérifier l'ID fourni."); 
  }

  const body = req.body;

  const { success, data, error } = createVoteSchema.safeParse(body);
  if (!success) {
    throw new BadRequestError("Validation error: " + JSON.stringify(error.errors)); 
  }

  vote.vote = data.vote || vote.vote;
  await vote.save();
  
  res.json(vote);
}





 