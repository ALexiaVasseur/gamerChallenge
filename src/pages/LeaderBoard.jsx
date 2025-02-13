import { useEffect, useState } from "react";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/leaderboard")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Erreur de récupération:", err));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen py-10">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6">🏆 Leaderboard</h1>
      <div className="w-full max-w-4xl overflow-hidden rounded-lg shadow-lg">
        <div className="flex flex-col">
          {/* En-tête doré */}
          <div className="flex items-center justify-between p-4 bg-[#9f8b20] text-white rounded-lg mb-1">
            <div className="w-1/4 text-left font-bold">Position</div>
            <div className="w-1/2 text-left">Pseudo</div>
            <div className="w-1/4 text-left">Score</div>
          </div>

          {/* Liste des joueurs */}
          {players.map((player, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 bg-[#9f8b20] text-white ${index !== players.length - 1 && 'mb-1'} rounded-lg`}
            >
              <div className="w-1/4 font-bold">#{index + 1}</div>
              <div className="w-1/2">{player.pseudo}</div>
              <div className="w-1/4">{player.score_global}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;



