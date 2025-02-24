import { Category, Challenge, Account } from "../models/index.js"; 
import { NotFoundError} from "../lib/errors.js"

// Retrieve all categories with their associated challenges
export async function getAllCategories(req, res) {
  const categories = await Category.findAll({
    include: {
      model: Challenge,
      as: "challenges",
      attributes: ['id', 'title', 'description', 'image_url'],
    },
  });

  if (!categories.length) {
    throw new NotFoundError("Aucune catégorie trouvée.");
  }

  res.status(200).json(categories);
}

// Retrieve a specific category with its associated challenges
export async function getOneCategory(req, res) {
  const categoryId = req.params.id;

  const category = await Category.findOne({
    where: { id: categoryId },
    include: {
      model: Challenge,
      as: "challenges",
      attributes: ['id', 'title', 'description', 'image_url'],
      include: [
        {
          model: Account,
          as: "account",
          attributes: ['id', 'pseudo']
        }
      ]
    },
  });

  if (!category) {
    throw new NotFoundError("Catégorie non trouvée.");
  }

  res.status(200).json(category);
}
