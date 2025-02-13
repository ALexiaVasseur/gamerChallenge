import { Challenge, Participate, Vote } from "../models/index.js"; // Adapte le chemin selon ta structure de dossiers
import { z } from "zod"; // Import de Zod
import { hash, compare, generateJwtToken, verifyJwtToken } from "../crypto.js";

// récupérer tous les votes
export async function getAllVotes(req, res) {
  try {
    const votes = await Vote.findAll();
    res.status(200).json(votes);
  }catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}

// recupérer un vote

export async function getOneVote(req, res) {
  try {
    const vote = await Vote.findByPk(req.params.id);
    if(!vote) return res.status(404).json({ message: "Vote non trouvé."})
    res.status(200).json(vote);
  }catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}


// créer une partitipation

const createVoteSchema = z.object({
  account_id: z.number().int().positive("L'ID du compte doit être un entier positif."),
  participation_id: z.number().int().positive("L'ID de participation doit être un entier positif."),
  vote: z.number().int().min(1).max(5),
});

export async function createVote(req, res) {
  try {
    console.log("🛠 Requête reçue:", req.body);

    // Validation avec Zod
    const { success, data, error } = createVoteSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({ error: error.errors });
    }

    // ici
    const idChallenge = req.params.idChallenge;
    const challenge = await Challenge.findByPk(idChallenge);
    if(!challenge) return res.status(404).json({ message: "Challenge non trouvé."})

    const idParticipation = req.params.idParticipation;
    const participation = await Participate.findByPk(idParticipation);
    if(!participation) return res.status(404).json({ message: "Participation non trouvée."})
    
    // Création du vote
    await Vote.create({
      account_id: data.account_id,
      participation_id: data.participation_id,
      vote: data.vote
    });

    res.status(201).json({
      message: "Vote créé avec succès.",
    });

  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}

// mettre à jour un vote

export async function updateVote(req,res) {
  const challengeId = parseInt(req.params.idChallenge)
  const participationId = parseInt(req.params.idParticipation)
  const voteId = parseInt(req.params.idvote)

  const challenge = await Challenge.findByPk(challengeId);
  if(!challenge) return res.status(404).json({ message: "Challenge non trouvé."})

  const participation = await Participate.findByPk(participationId);
  if(!participation) return res.status(404).json({ message: "Participation non trouvée."})
    
  const vote = await Vote.findByPk(voteId);

  if (!vote) {
    return res.status(404).json({ error: "vote not found. Please verify the provided id." })
  }

  const body = req.body;

 // Valider le body
  const { error, data } = createVoteSchema.safeParse(body);
  // Si error => 400
  if (error) {
    return res.status(400).json({ error: error.message });
  }


  // Procéder à l'update
  vote.vote = data.vote || vote.vote;
  await vote.save();
  
  res.json(vote)
}





