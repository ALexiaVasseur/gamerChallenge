import { Category, Challenge, Account } from "../models/index.js"; // Assure-toi que tu importes correctement Category et Challenge

// Récupérer toutes les catégories avec leurs challenges associés
export async function getAllCategories(req, res) {
  try {
    const categories = await Category.findAll({
      include: {
        model: Challenge,
        as: "challenges", // Assure-toi que l'association est bien nommée
        attributes: ['id', 'title', 'description', 'image_url'], // Exemple de champs des challenges à inclure
      },
    });

    if (!categories.length) {
      return res.status(404).json({ message: "Aucune catégorie trouvée." });
    }

    res.status(200).json(categories);
  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}

// Récupérer une catégorie spécifique avec ses challenges associés
export async function getOneCategory(req, res) {
  const categoryId = req.params.id;

  try {
    const category = await Category.findOne({
      where: { id: categoryId },
      include: {
        model: Challenge,
        as: "challenges",
        attributes: ['id', 'title', 'description', 'image_url'], // Ajout de 'video_url'
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
      return res.status(404).json({ message: "Catégorie non trouvée." });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("🔥 Erreur serveur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}
