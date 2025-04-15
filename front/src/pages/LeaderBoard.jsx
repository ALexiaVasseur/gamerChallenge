import { useEffect, useState } from "react";
import badgeImage1 from "../assets/images/badge_1.webp";
import badgeImage2 from "../assets/images/badge_2.webp";
import badgeImage3 from "../assets/images/badge_3.webp";
import badgeImage4 from "../assets/images/badge_4.webp";

const badgesList = [
  { threshold: 5, name: "Débutant Ardant", imageUrl: badgeImage1 },
  { threshold: 10, name: "Étoile Montante", imageUrl: badgeImage2 },
  { threshold: 15, name: "Champion Brillant", imageUrl: badgeImage3 },
  { threshold: 20, name: "Légende Ultime", imageUrl: badgeImage4 },
];

const getBadgeForScore = (score) => {
  const badge = badgesList
    .slice()
    .reverse()
    .find((b) => score >= b.threshold);
  return badge || null;
};

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    window.dispatchEvent(new Event("userChanged"));
    fetch("http://localhost:3000/api/leaderboard")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Erreur de récupération:", err));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-yellow-500 mb-8 text-center">🏆 Leaderboard</h1>

      <div className="w-full max-w-5xl overflow-hidden rounded-lg shadow-xl">
        <div className="grid grid-cols-4 py-3 px-6 text-lg sm:text-xl text-white font-medium bg-[#9f8b20] rounded-lg mb-2 shadow-md">
          <div className="text-left">Position</div>
          <div className="text-center">Pseudo</div>
          <div className="text-center">Badge</div>
          <div className="text-right">Score</div>
        </div>

        <div className="py-4 px-2 sm:px-4 rounded-b-lg">
          {players.length > 0 ? (
            players
              .filter((player) => !player.pseudo.startsWith("Utilisateur supprimé"))
              .map((player, index) => {
                const badge = getBadgeForScore(player.score_global);
                return (
                  <div
                    key={index}
                    className="grid grid-cols-4 py-3 px-6 text-lg sm:text-xl text-white font-medium bg-[#9f8b20] rounded-lg mb-2 shadow-md"
                  >
                    <div className="text-left">#{index + 1}</div>
                    <div className="text-center">{player.pseudo}</div>
                    <div className="text-center flex items-center justify-center space-x-2">
                      {badge ? (
                        <>
                          <img src={badge.imageUrl} alt={badge.name} className="w-8 h-8" />
                          <span className="text-sm text-white">{badge.name}</span>
                        </>
                      ) : (
                        <span className="text-gray-400">Aucun</span>
                      )}
                    </div>
                    <div className="text-right">{player.score_global}</div>
                  </div>
                );
              })
          ) : (
            <p className="text-center text-yellow-400 py-6 text-lg">Aucun joueur trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
