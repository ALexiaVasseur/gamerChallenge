import { useEffect, useState } from "react";

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/freetogames");
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        const filteredGames = data.map((game) => ({
          id: game.id,
          title: game.title,
          thumbnail: game.thumbnail,
          game_url: game.game_url,
          genre: game.genre, // Supposons que chaque jeu a un attribut 'genre'
        }));
        setGames(filteredGames);
        setFilteredGames(filteredGames); // Initialiser avec tous les jeux
      } catch (err) {
        console.error("Error fetching games:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    let filtered = games;

    // Appliquer le filtre sur le genre
    if (selectedGenre) {
      filtered = filtered.filter((game) => game.genre === selectedGenre);
    }

    // Appliquer la recherche
    if (searchQuery) {
      filtered = filtered.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredGames(filtered);
  }, [searchQuery, selectedGenre, games]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
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

      {/* Barre de recherche */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Rechercher un jeu"
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 rounded-lg text-black w-1/3"
        />
      </div>

      {/* Filtre par genre */}
      <div className="flex justify-center mb-6">
        <select
          value={selectedGenre}
          onChange={handleGenreChange}
          className="px-4 py-2 rounded-lg text-black"
        >
          <option value="">Tous les genres</option>
          <option value="Action">Action</option>
          <option value="Aventure">Aventure</option>
          <option value="RPG">RPG</option>
          <option value="Stratégie">Stratégie</option>
          <option value="Simulation">Simulation</option>
          {/* Ajoute d'autres genres si nécessaire */}
        </select>
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
