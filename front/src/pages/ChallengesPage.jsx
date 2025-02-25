import { useEffect, useState } from "react";
import ChallengeCard from "../components/ChallengeCard";

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChallenges, setFilteredChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/challenges");
        if (!response.ok) {
          throw new Error(`Erreur réseau: ${response.statusText}`);
        }
        const data = await response.json();

        // Transformation des données pour s'assurer qu'elles sont bien formatées
        const formattedChallenges = data.map((challenge) => ({
          id: challenge.id,
          title: challenge.title,
          author: challenge.account?.pseudo || "Anonyme",
          image: challenge.image_url,
        }));

        setChallenges(formattedChallenges);
        setFilteredChallenges(formattedChallenges);
      } catch (err) {
        console.error("Erreur lors de la récupération des challenges:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  useEffect(() => {
    let filtered = challenges;

    if (searchQuery) {
      filtered = filtered.filter((challenge) =>
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredChallenges(filtered);
  }, [searchQuery, challenges]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <p className="text-center text-white">Chargement des challenges...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Erreur : {error}</p>;
  }

  return (
    <div className="min-h-screen w-full">
      <h1 className="text-3xl font-bold mb-4 text-white text-center py-8">
        Liste des Challenges
      </h1>

      {/* Barre de recherche */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Rechercher un challenge"
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 rounded-lg text-white border-2 border-[rgba(159,139,32,0.7)] w-1/3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(159,139,32,0.9)]"
        />
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                id={challenge.id}
                title={challenge.title}
                author={challenge.author}
                image={challenge.image}
              />
            ))
          ) : (
            <p className="text-white text-center">Aucun challenge ne correspond à votre recherche.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
