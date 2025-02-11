import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [badges, setBadges] = useState([]); 

  const userId = Number(localStorage.getItem("userId")) || 1; // Remplace par la vraie source

  useEffect(() => {
    // Vérifie que userId est bien un nombre valide
    if (!userId || isNaN(userId)) {
      console.error("ID utilisateur invalide !");
      return;
    }

    // Récupérer les informations de l'utilisateur
    console.log("userId:", userId, typeof userId);
    fetch(`http://localhost:3000/api/user/${userId}`) // ✅ Backticks au lieu de guillemets
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setBadges(data.badges || []);
      })
      .catch(error => console.error("Erreur lors du chargement du profil:", error));
  }, [userId]); // Dépendance ajoutée pour assurer la mise à jour

  if (!user) return <p>Chargement du profil...</p>;

  return (
    <div>
      <main className="container mx-auto p-6">
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold">{user.pseudo}</h1>
          <p className="text-lg">Score global: {user.score_global}</p>
          <p className="text-lg">Email: {user.email}</p>
          <h2 className="text-xl font-semibold mt-4">Badges:</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {badges.length > 0 ? (
              badges.map(badge => (
                <span key={badge.id} className="bg-blue-500 text-white px-3 py-1 rounded-md">
                  {badge.name}
                </span>
              ))
            ) : (
              <p>Aucun badge obtenu</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
