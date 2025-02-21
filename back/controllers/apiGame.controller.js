// Fonction pour récupérer les jeux
export const getGames = async (req, res) => {
  try {
    const response = await fetch('https://www.freetogame.com/api/games'); // Appel à l'API externe
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des jeux');
    }
    const data = await response.json(); // Analyse la réponse JSON
    res.json(data); // Renvoie les données au client
  } catch (error) {
    console.error("Erreur lors de la récupération des jeux:", error);
    res.status(500).json({ message: 'Erreur lors de la récupération des jeux' }); // Envoi d'une réponse d'erreur
  }
};

