import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    window.dispatchEvent(new Event("userChanged"));
    const userData = localStorage.getItem("user");
    if (userData) {
      const userInformations = JSON.parse(userData);
      setUserId(userInformations.id);
    }
  }, []);

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      console.error("ID utilisateur invalide !");
      return;
    }

    fetch(`http://localhost:3000/api/user/${userId}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);

        // Récupérer les challenges réussis (participate -> challenge)
        const completed = data.participate
          ? data.participate.map((p) => p.challenge)
          : [];
        setCompletedChallenges(completed);

        // Récupérer les participations
        setParticipations(data.participate || []);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement du profil:", error)
      );
  }, [userId]);

  if (!user)
    return (
      <p className="text-center mt-10 text-white">
        Vous ne possédez aucun compte.
      </p>
    );

  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : "??";
  };

  return (
    <div className="flex flex-col items-center w-full px-6 py-10 text-white">
      {/* Avatar & Infos */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start w-full max-w-5xl space-y-6 lg:space-y-0 lg:space-x-12">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-yellow-500 flex items-center justify-center text-2xl sm:text-3xl font-bold bg-gray-700">
            {getInitials(user.pseudo)}
          </div>
          <p className="mt-4 text-center text-gray-400">
            {user.description || "Aucune description fournie."}
          </p>
        </div>

        <div className="text-center lg:text-left w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold">{user.pseudo}</h1>
          <p className="text-lg mt-2 break-all">Email: {user.email}</p>
          <p className="text-lg">Score Global: {user.score_global ?? 0}</p>
          <p className="text-lg">Mot de passe: *******</p>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-orange-600 w-full sm:w-auto">
            Modifier le profil
          </button>
        </div>
      </div>

      {/* Section Challenges Réussis et Participations côte à côte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 w-full max-w-5xl">
        {/* Challenges Réussis */}
        <div>
          <h2 className="text-2xl font-semibold border-b border-gray-600 pb-3">
            Challenges réussis
          </h2>
          <ul className="text-lg mt-4 space-y-2">
            {completedChallenges.length > 0 ? (
              completedChallenges.map((challenge) => (
                <li key={challenge.id} className="flex items-center space-x-3">
                  {challenge.image_url && (
                    <img
                      src={challenge.image_url}
                      alt={challenge.title}
                      className="w-8 h-8 rounded-md"
                    />
                  )}
                  <span>✅ {challenge.title}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-400">Aucun challenge réussi</p>
            )}
          </ul>
        </div>

        {/* Participations */}
        <div>
          <h2 className="text-2xl font-semibold border-b border-gray-600 pb-3">
            Participations
          </h2>
          <ul className="text-lg mt-4 space-y-4">
            {participations.length > 0 ? (
              participations.map((participation) => (
                <li key={participation.id} className="border border-gray-600 p-4 rounded-lg">
                  <p className="font-semibold">
                    A participé à : <span className="text-[#9F8B20]">{participation.challenge.title}</span>
                  </p>
                  {participation.video_url && (
                    <p className="mt-2">
                      🎥 <a href={participation.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                        Voir la vidéo
                      </a>
                    </p>
                  )}
                </li>
              ))
            ) : (
              <p className="text-gray-400">Aucune participation enregistrée</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
