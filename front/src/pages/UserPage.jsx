import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [onlineChallenges, setOnlineChallenges] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    window.dispatchEvent(new Event("userChanged"));
    const userData = localStorage.getItem("user");
    if (userData) {
      const userInformations = JSON.parse(userData);
      setUserId(userInformations.id);
    }
  }, [])

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      console.log(userId);
      console.error("ID utilisateur invalide !");
      return;
    }

    fetch(`http://localhost:3000/api/user/${userId}`, {
      credentials: 'include',
    }
    )
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setCompletedChallenges(data.completedChallenges || []);
        setOnlineChallenges(data.onlineChallenges || []);
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
      
      {/* Section Avatar et Infos */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start w-full max-w-5xl space-y-6 lg:space-y-0 lg:space-x-12">
        
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-yellow-500 flex items-center justify-center text-2xl sm:text-3xl font-bold bg-gray-700">
            {getInitials(user.pseudo)}
          </div>
          <p className="mt-4 text-center text-gray-400">
            {user.description || "Aucune description fournie."}
          </p>
        </div>

        {/* Infos utilisateur */}
        <div className="text-center lg:text-left w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold">{user.pseudo}</h1>
          <p className="text-lg mt-2 break-all">Email: {user.email}</p>

          <p className="text-lg">Score Global: {user.score_global ?? 0}</p>
          

          <p className="text-lg">Mot de passe: *******</p>

          {/* Bouton Modifier */}
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-orange-600 w-full sm:w-auto">
            Modifier le profil
          </button>
        </div>
      </div>

      {/* Section Challenges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10 w-full max-w-5xl">
        <div>
          <h2 className="text-2xl font-semibold border-b border-gray-600 pb-3">
            Challenge réussi
          </h2>
          <ul className="text-lg mt-4 space-y-2">
            {completedChallenges.length > 0 ? (
              completedChallenges.map((challenge, index) => (
                <li key={index}>{challenge.title}</li>
              ))
            ) : (
              <p className="text-gray-400">Aucun challenge réussi</p>
            )}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold border-b border-gray-600 pb-3">
            Challenge en ligne
          </h2>
          <ul className="text-lg mt-4 space-y-2">
            {onlineChallenges.length > 0 ? (
              onlineChallenges.map((challenge, index) => (
                <li key={index}>{challenge.title}</li>
              ))
            ) : (
              <p className="text-gray-400">Aucun challenge en ligne</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
