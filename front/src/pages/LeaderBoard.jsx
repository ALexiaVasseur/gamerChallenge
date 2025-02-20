import { useEffect, useState } from "react";

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

      <div className="w-full max-w-4xl overflow-hidden rounded-lg shadow-xl">
        {/* En-tête */}
        <div className="grid grid-cols-3 py-3 px-6 text-lg sm:text-xl text-white font-medium bg-[#9f8b20] rounded-lg mb-2 shadow-md">
          <div className="text-left">Position</div>
          <div className="text-center">Pseudo</div>
          <div className="text-right">Score</div>
        </div>

        {/* Liste des joueurs */}
        <div className="py-4 px-2 sm:px-4 rounded-b-lg">
          {players.length > 0 ? (
            players.map((player, index) => (
              <div
                key={index}
                className="grid grid-cols-3 py-3 px-6 text-lg sm:text-xl text-white font-medium bg-[#9f8b20] rounded-lg mb-2 shadow-md"
              >
                <div className="text-left">#{index + 1}</div>
                <div className="text-center">{player.pseudo}</div>
                <div className="text-right">{player.score_global}</div>
              </div>
            ))
          ) : (
            <p className="text-center text-yellow-400 py-6 text-lg">Aucun joueur trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
