import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [badges, setBadges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [onlineChallenges, setOnlineChallenges] = useState([]);

  const userId = Number(localStorage.getItem("userId")) || 1;

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      console.error("ID utilisateur invalide !");
      return;
    }

    fetch(`http://localhost:3000/api/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setBadges(data.badges || []);
        setCompletedChallenges(data.completedChallenges || []);
        setOnlineChallenges(data.onlineChallenges || []);
      })
      .catch(error => console.error("Erreur lors du chargement du profil:", error));
  }, [userId]);

  if (!user) return <p className="text-center mt-10 text-white">Chargement du profil...</p>;

  console.log("user", user);

  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : "??";
  };

  return (
    <div className="grid grid-cols-2 gap-10 p-10 w-full text-white">
      
      {/* Section gauche : Avatar + Description */}
      <div className="flex flex-col items-center justify-between">
        
        {/* Avatar en haut à gauche */}
        <div className="w-120 h-120 rounded-full border-4 border-yellow-500 flex items-center justify-center text-3xl font-bold bg-gray-700">
          {getInitials(user.pseudo)}
        </div>


        {/* Description sous l'avatar */}
        <p className="text-left text-md mt-6">
          {user?.description ? (
          user.description
          ) : (
          <span className="text-gray-400">Aucune description fournie.</span>
          )}
        </p>

      </div>

      {/* Section droite : Infos utilisateur en haut + Challenges en bas */}
      <div className="flex flex-col justify-between h-full">
        
        {/* Infos utilisateur en haut à droite */}
        <div>
          <h1 className="text-4xl font-bold">{user.pseudo}</h1>
          <p className="text-lg mt-2">Email: {user.email}</p>
          <p className="text-lg">Téléphone: {user.phone || "0000000000"}</p>
          <p className="text-lg">Mot de passe: *******</p>

          {/* Bouton Modifier le profil */}
          <button className="bg-orange-500 text-white px-5 py-3 rounded-lg mt-6 hover:bg-orange-600">
            Modifier le profil
          </button>
        </div>

        {/* Challenges en bas à droite */}
        <div className="grid grid-cols-2 gap-8 mt-10">
          <div>
            <h2 className="text-2xl font-semibold border-b border-gray-600 pb-3">Challenge réussi</h2>
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
            <h2 className="text-2xl font-semibold border-b border-gray-600 pb-3">Challenge en ligne</h2>
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
    </div>
  );
};

export default Profile;
