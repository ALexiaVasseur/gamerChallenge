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
      <div className="w-full max-w-4xl overflow-hidden border-4 border-[#9f8b20] rounded-lg shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#9f8b20] text-white">
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Pseudo</th>
              <th className="px-4 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr
                key={index}
                className={`text-white bg-[#9f8b20] transition`}
              >
                <td className="px-4 py-3 font-bold">#{index + 1}</td>
                <td className="px-4 py-3">{player.pseudo}</td>
                <td className="px-4 py-3">{player.score_global}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
