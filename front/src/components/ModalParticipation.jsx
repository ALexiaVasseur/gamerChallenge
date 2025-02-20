import { useState } from "react";

/* eslint-disable react/prop-types */
const ModalParticipation = ({ isOpen, onClose, challengeId, onSubmit }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [vote, setVote] = useState(1);
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [newScore, setNewScore] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");


  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // Si la modale n'est pas ouverte, on retourne null (ne l'affiche pas)
  if (!isOpen) return null;

  // Fonction de validation de l'URL de la vidéo YouTube
  const isValidUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    return youtubeRegex.test(url);
  };

  // Fonction pour soumettre la participation et le vote
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
  
    // Vérification des champs
    if (!videoUrl.trim() || !description.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      setLoading(false);
      return;
    }
  
    if (!isValidUrl(videoUrl)) {
      setErrorMessage("L'URL de la vidéo n'est pas valide.");
      setLoading(false);
      return;
    }

    if (!userId) {
      setErrorMessage("Utilisateur non authentifié.");
      setLoading(false);
      return;
    }
    
  
    try {
      // 1. Créer la participation
      console.log("Tentative de création de participation...");
      const participationResponse = await fetch(
        `http://localhost:3000/api/challenge/${challengeId}/participations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ challenge_id: challengeId, video_url: videoUrl, description, vote, account_id: userId, }), // Ou toute autre donnée que tu veux envoyer
        }
      );
  
      if (!participationResponse.ok) {
        const participationError = await participationResponse.json();
        console.error("Erreur de création de participation:", participationError);
        throw new Error(participationError.message || "Erreur lors de la création de la participation");
      }
  
      const participationData = await participationResponse.json();
      if (!participationData.participation.id) {
        throw new Error("ID de la participation manquant dans la réponse.");
      }

      const participationId = participationData.participation.id; // Récupérer l'ID de la participation
      console.log("Participation créée avec succès. ID de participation:", participationId);
  
      // 2. Créer un vote
      console.log("Tentative de création du vote...");
      const voteResponse = await fetch(
        `http://localhost:3000/api/challenge/${challengeId}/participation/${participationId}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account_id: userId, // Remplacez `userId` par la vraie variable contenant l'ID du compte
            participation_id: participationId,
            vote,
          }),
        }
      );
      
  
      if (!voteResponse.ok) {
        const voteError = await voteResponse.json();
        console.error("Erreur lors de la création du vote:", voteError);
        throw new Error(voteError.message || "Erreur lors de l'envoi du vote");
      }
  
       // 3. Mise à jour du score de l'utilisateur
    // 3. Mise à jour du score de l'utilisateur
const updateScoreResponse = await fetch(
  `http://localhost:3000/api/user/${userId}/updateScore`, // Assurez-vous que l'URL correspond à celle que tu utilises pour la mise à jour du score
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ point: vote }), // Le vote sera utilisé comme nombre de points
  }
);

if (!updateScoreResponse.ok) {
  const updateScoreError = await updateScoreResponse.json();
  console.error("Erreur lors de la mise à jour du score :", updateScoreError);
  throw new Error(updateScoreError.message || "Erreur lors de la mise à jour du score");
}

// Récupérer les données après avoir validé la réponse
const updateScoreData = await updateScoreResponse.json();
console.log("Score mis à jour avec succès :", updateScoreData.newScore);

// Mettre à jour l'état newScore
setNewScore(updateScoreData.newScore);


      // Réinitialisation du formulaire après soumission
      setVideoUrl("");
      setVote(1);
      setDescription("");
      setLoading(false);
      setSuccessMessage("Votre participation a été envoyée avec succès et votre vote a été pris en compte !");
  
      // Attendre quelques secondes avant de fermer la modale pour permettre à l'utilisateur de voir le message
    setTimeout(() => {
      onClose(); // Ferme la modale après un délai
    }, 3000); // Délai de 3 secondes
  
       
  
      // Appel de la fonction de callback de soumission
      if (onSubmit) onSubmit();
  
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setErrorMessage(error.message || "Une erreur est survenue lors de l'envoi.");
      setLoading(false);
    }
  };
  

  // Fonction pour fermer la modale immédiatement (sans soumission)
  const handleClose = () => {
    setVideoUrl(""); // Réinitialiser les champs
    setVote(1);
    setDescription("");
    setErrorMessage(""); // Effacer les erreurs avant de fermer
    onClose(); // Ferme la modale
  };

  console.log("Votes : ", {vote});

  return ( 
    <div className="fixed inset-0 flex justify-center items-center bg-opacity-40 backdrop-blur-lg transition-opacity duration-300 z-50">
      <div className="bg-[#222] text-white p-6 rounded-lg shadow-lg w-[400px] relative animate-fadeIn">
        <h2 className="text-3xl font-bold text-center mb-4">Publier ma participation</h2>

        {/* Affichage du message de succès */}
        {successMessage && (
        <p className="text-green-500 text-center mt-2">{successMessage}</p>
        )}

        {/* Affichage des erreurs */}
        {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="URL de la vidéo YouTube"
            className="p-2 rounded bg-gray-300 text-black"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          {/* Étoiles pour le vote */}
          <div className="flex justify-center">
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                className={`cursor-pointer text-3xl ${num <= vote ? "text-yellow-500" : "text-gray-400"}`}
                onClick={() => setVote(num)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Décrivez votre participation..."
            className="p-2 rounded bg-gray-300 text-black h-20 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            type="submit"
            className="bg-[rgba(159,139,32,0.7)] hover:bg-[rgba(159,139,32,1)] text-white py-2 rounded font-semibold disabled:bg-gray-500"
            disabled={loading}
          >
            {loading ? "Envoi en cours..." : "Soumettre"}
          </button>
        </form>

        {/* Affichage du nouveau score */}
      {newScore !== null && (
        <div className="mt-4 text-center">
          <p>Votre nouveau score est : <strong>{newScore}</strong></p>
        </div>
      )}

        {/* Bouton ✖ qui ferme immédiatement la modale */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-white text-lg"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default ModalParticipation;
