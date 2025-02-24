import { useEffect, useState, useCallback } from "react";
import badgeImage1 from "../assets/images/badge_1.webp";
import badgeImage2 from "../assets/images/badge_2.webp";
import badgeImage3 from "../assets/images/badge_3.webp";
import badgeImage4 from "../assets/images/badge_4.webp";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    pseudo: "",
    email: "",
    description: "",
  });
  const [badges, setBadges] = useState([]);

  const assignBadges = useCallback((score) => {
    const badgeList = [
      { threshold: 5, name: "Débutant Ardant ", imageUrl: badgeImage1 },
      { threshold: 10, name: "Étoile Montante", imageUrl: badgeImage2 },
      { threshold: 15, name: "Champion Brillant ", imageUrl: badgeImage3 },
      { threshold: 20, name: "Légende Ultime", imageUrl: badgeImage4 },
    ];

    const existingBadgeNames = new Set(badges.map((b) => b.badge.name));

    const newBadges = badgeList
      .filter((badge) => score >= badge.threshold && !existingBadgeNames.has(badge.name))
      .map((badge) => ({
        id: `${badge.name}-${Date.now()}`, 
        badge,
      }));

    if (newBadges.length > 0) {
      setBadges((prevBadges) => [...prevBadges, ...newBadges]);
    }
  }, [badges]);

  useEffect(() => {
    window.dispatchEvent(new Event("userChanged"));
    const userData = localStorage.getItem("user");
    if (userData) {
      const userInformations = JSON.parse(userData);
      setUserId(userInformations.id);
      console.log("ID utilisateur défini :", userInformations.id);
    } else {
      console.error("Aucune donnée utilisateur trouvée dans le localStorage.");
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || isNaN(userId)) {
        console.error("ID utilisateur invalide !");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
          credentials: "include",
        });
        const data = await response.json();

        setUser(data);
        setFormData({
          pseudo: data.pseudo,
          email: data.email,
          description: data.description || "",
        });

        setCompletedChallenges(data.participate ? data.participate.map((p) => p.challenge) : []);
        setParticipations(data.participate || []);

        assignBadges(data.score_global);
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      }
    };

    fetchUserData();
  }, [userId, assignBadges]);

  if (!user)
    return (
      <p className="text-center mt-10 text-white">
        Vous ne possédez aucun compte.
      </p>
    );

  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : "??";
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      pseudo: user.pseudo,
      email: user.email,
      description: user.description || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (!data) {
        console.error("Erreur lors de la mise à jour du profil:", data.message);
      }
      setUser(data.user);
      setIsEditing(false);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible."
      )
    ) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("user");
        window.location.href = "/";
      } else {
        const errorData = await response.json(); 
        console.error("Erreur lors de la suppression du compte:", errorData);
        alert(`Erreur: ${errorData.message || "Une erreur inconnue est survenue."}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
      alert("Une erreur est survenue, veuillez réessayer plus tard.");
    }
  };
  

  return (
    <div className="flex flex-col items-center w-full px-6 py-10 text-white">
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

          <div className="mt-4">
            <h2 className="text-xl font-semibold">Badges obtenus</h2>
            <div className="flex space-x-4 mt-2">
              {badges.length > 0 ? (
                badges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center">
                    <img
                      src={badge.badge.imageUrl}
                      alt={badge.badge.name}
                      className="w-16 h-16"
                    />
                    <span className="text-sm text-gray-400">{badge.badge.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Aucun badge obtenu</p>
              )}
            </div>
          </div>

          {isEditing ? (
  <div className="mt-4">
    <input
      type="text"
      name="pseudo"
      value={formData.pseudo}
      onChange={handleChange}
      className="block w-full px-4 py-2 mb-2 rounded-lg bg-gray-700 text-white"
      placeholder="Pseudo"
    />
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      className="block w-full px-4 py-2 mb-2 rounded-lg bg-gray-700 text-white"
      placeholder="Email"
    />
    <textarea
      name="description"
      value={formData.description}
      onChange={handleChange}
      className="block w-full px-4 py-2 mb-2 rounded-lg bg-gray-700 text-white"
      placeholder="Description"
    />
    <div className="flex space-x-4 mt-4">
      <button
        onClick={handleSave}
        className="bg-[rgba(159,139,32,0.7)] text-white px-4 py-2 rounded-lg hover:bg-[rgba(159,139,32,0.9)] w-full sm:w-auto"
      >
        Sauvegarder
      </button>
      <button
        onClick={handleCancelEdit}
        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-full sm:w-auto"
      >
        Annuler
      </button>
    </div>
  </div>
) : (
  <div className="flex space-x-4 mt-4">
    <button
      onClick={handleEditClick}
      className="bg-[rgba(159,139,32,0.7)] text-white px-4 py-2 rounded-lg hover:bg-[rgba(159,139,32,0.9)] w-full sm:w-auto"
    >
      Modifier le profil
    </button>

    <button
      onClick={handleDeleteAccount}
      className="bg-[rgba(159,139,32,0.7)] text-white px-4 py-2 rounded-lg hover:bg-[rgba(159,139,32,0.9)] w-full sm:w-auto"
    >
      Supprimer mon compte
      <span className="ml-2 text-xl text-white">❌</span>
    </button>
  </div>
)}

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 w-full max-w-5xl">
        <div>
          <h2 className="text-2xl font-semibold border-b border-gray-600 pb-3">
            Challenges réussis
          </h2>
          <ul className="text-lg mt-4 space-y-2">
            {completedChallenges.length > 0 ? (
              completedChallenges.map((challenge, index) => (
                <li key={`${challenge.id}-${index}`} className="flex items-center space-x-3">
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

        <div>
          <h2 className="text-2xl font-semibold border-b border-gray-600 pb-3">
            Participations
          </h2>
          <ul className="text-lg mt-4 space-y-4">
  {participations.length > 0 ? (
    participations.map((participation, index) => (
      <li
        key={`${participation.id}-${index}`}
        className="border border-gray-600 p-4 rounded-lg"
      >
        <p className="font-semibold">
          A participé à :{" "}
          <span className="text-[#9F8B20]">
            {participation.challenge.title}
          </span>
        </p>
        {participation.video_url && (
          <p className="mt-2">
            🎥{" "}
            <a
              href={participation.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
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
