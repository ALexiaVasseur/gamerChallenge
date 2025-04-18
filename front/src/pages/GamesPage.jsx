import { useEffect, useState } from "react";

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL; // Utilise la variable d'environnement


  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${apiUrl}/freetogames`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        const filteredGames = data.map((game) => ({
          id: game.id,
          title: game.title,
          thumbnail: game.thumbnail,
          game_url: game.game_url,
        }));
        setGames(filteredGames);
        setFilteredGames(filteredGames);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [apiUrl]);

  useEffect(() => {
    let filtered = games;

    if (searchQuery) {
      filtered = filtered.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredGames(filtered);
  }, [searchQuery, games]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <p className="text-center text-white">Chargement des jeux...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Erreur: {error}</p>;
  }

  return (
    <div className="min-h-screen w-full">
      <h1 className="text-3xl font-bold mb-4 text-white text-center py-8">
        Liste des Jeux
      </h1>

      {/* Barre de recherche avec style amélioré */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Rechercher un jeu"
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 rounded-lg text-white border-2 border-[rgba(159,139,32,0.7)] w-1/3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(159,139,32,0.9]"
        />
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <div
                key={game.id}
                className="backdrop-blur-sm p-0 rounded-lg flex flex-col items-center text-center cursor-pointer transition transform hover:scale-105 duration-300"
              >
                <a href={game.game_url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-56 object-cover rounded-t-lg"
                  />
                  <div className="w-full bg-[rgba(159,139,32,0.7)] py-4 flex flex-col justify-center items-center rounded-b-lg">
                    <h2 className="text-xl font-bold text-white uppercase">
                      {game.title}
                    </h2>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <p className="text-white">Aucun jeu ne correspond à votre recherche.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameList;
