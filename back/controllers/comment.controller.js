import { Comment, Challenge, Account } from "../models/index.js";
import { NotFoundError} from "../lib/errors.js"
import { z } from "zod";

// retrieve all comments
export const getAllComments = async (req, res) => {
  const comments = await Comment.findAll({
    include: [
      {
        model: Account,
        as: 'account', 
        attributes: ['pseudo'],
      },
      {
        model: Challenge,
        as: 'challenge',
        attributes: ['title'],
      }
    ],
  });
  res.json(comments);
};




// Recover a comment
export async function getOneComment(req, res) {
  const comment = await Comment.findByPk(req.params.id);
  if (!comment) throw new NotFoundError("Commentaire non trouvé.");
  res.status(200).json(comment);
}


const createCommentSchema = z.object({
  challenge_id: z.number().int().positive("L'ID du challenge doit être un entier positif."),
  text: z.string().min(1, "Le commentaire est requis.")
});

// Create a comment
export async function createComment(req, res) {
  const { success, data, error } = createCommentSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error: error.errors });
  }

  const { challenge_id, text } = data;
  const account_id = req.userId; 

  if (!account_id) {
    return res.status(401).json({ message: "Utilisateur non authentifié." });
  }

  const challenge = await Challenge.findByPk(challenge_id);
  if (!challenge) return res.status(404).json({ message: "Challenge non trouvé." });

  const account = await Account.findByPk(account_id);
  if (!account) throw new NotFoundError("Compte non trouvé.");

  const existingComment = await Comment.findOne({
    where: {
      challenge_id: challenge_id,
      account_id: account_id
    }
  });

  if (existingComment) {
    return res.status(400).json({ message: "Vous avez déjà commenté ce défi." });
  }

  const newComment = await Comment.create({
    account_id,
    challenge_id,
    text,
  });

  const commentResponse = {
    id: newComment.id,
    account_id: newComment.account_id,
    challenge_id: newComment.challenge_id,
    text: newComment.text,
    created_at: newComment.createdAt,
    updated_at: newComment.updatedAt,
    account: {
      pseudo: account.pseudo
    }
  };

  res.status(201).json(commentResponse);
}


// Function for retrieving comments from a specific challenge
export const getCommentsForChallenge = async (req, res) => {
  const { challengeId } = req.params;

  const comments = await Comment.findAll({
    where: { challenge_id: challengeId },
    include: [
      {
        model: Account,
        as: 'account', 
        attributes: ['pseudo'], 
      }
    ],
  });

  if (comments.length === 0) {
    throw new NotFoundError("Aucun commentaire trouvé pour ce challenge.");
  }

  res.json(comments);
};

