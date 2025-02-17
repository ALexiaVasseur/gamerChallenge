import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ChallengePage = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [comments, setComments] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState(null); // Pour stocker l'ID de l'utilisateur
  const token = localStorage.getItem("token"); // Récupérer le token du localStorage

  // Fonction pour récupérer l'URL d'intégration YouTube
  const getYouTubeEmbedUrl = (url) => {
    const match = url.match(/(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  // Récupérer les données du défi et les commentaires
  useEffect(() => {
    const fetchChallengeData = async () => {
      setLoading(true);
      try {
        const [challengeResponse, commentsResponse, participationsResponse] = await Promise.all([
          fetch(`http://localhost:3000/api/challenge/${id}`),
          fetch(`http://localhost:3000/api/challenges/${id}/comments`),
          fetch(`http://localhost:3000/api/participations/${id}`),
        ]);

        if (!challengeResponse.ok) throw new Error("Challenge introuvable");
        const challengeData = await challengeResponse.json();
        setChallenge(challengeData);

        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData);
        }

        if (participationsResponse.ok) {
          const participationsData = await participationsResponse.json();
          setParticipations(participationsData);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallengeData();
  }, [id]);

  // Fonction de connexion (mettez à jour les détails si nécessaire)
  const handleLogin = async (credentials) => {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token); // Stocker le token
      setUserId(data.userId); // Mettre à jour l'ID utilisateur
      console.log("Utilisateur connecté, token enregistré :", data.token);
    } else {
      console.error("Erreur de connexion");
    }
  };

  // Fonction pour soumettre un commentaire
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const challengeId = parseInt(id, 10);
    const accountId = userId; // Utiliser l'ID utilisateur

    if (!token) {
      console.error("Token non trouvé, utilisateur non authentifié");
      setError("Vous devez être connecté pour laisser un commentaire.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/challenge/${challengeId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          challenge_id: challengeId,
          text: newComment,
          account_id: accountId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de l'ajout du commentaire:", errorData);
        throw new Error(errorData.message || "Erreur inconnue");
      }

      const addedComment = await response.json();
      setComments([...comments, addedComment]);
      setNewComment("");
    } catch (error) {
      console.error("Erreur lors de la soumission du commentaire:", error.message);
    }
  };

  // Chargement et affichage des erreurs
  if (loading) return <p className="text-center text-gray-500 text-2xl">Chargement...</p>;
  if (error) return <p className="text-center text-red-500 text-2xl">{error}</p>;
  if (!challenge) return <p className="text-center text-gray-500 text-2xl">Challenge introuvable.</p>;

  return (
    <main className="mx-auto p-12 text-white">
      {challenge.image_url && (
        <img src={challenge.image_url} alt="Challenge Image" className="w-full h-[400px] object-cover rounded-lg shadow-2xl mb-6" />
      )}
      <h1 className="text-6xl font-bold text-center mt-6 mb-10">{challenge.title}</h1>
      {challenge.account && (
        <p className="text-center text-lg text-gray-400 mb-6">
          Créé par: <strong>{challenge.account.pseudo}</strong>
        </p>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          {challenge.game?.url_video_game && (
            <iframe className="w-full h-[300px] rounded-lg shadow-2xl" src={getYouTubeEmbedUrl(challenge.game.url_video_game)} title="Game Video" frameBorder="0" allowFullScreen></iframe>
          )}
          <details className="mt-10 bg-white/10 p-5 rounded-lg">
            <summary className="cursor-pointer text-3xl font-semibold">Voir les participations</summary>
            <div className="max-h-[500px] overflow-y-auto space-y-6 mt-4">
              {participations.length > 0 ? (
                participations.map((participation) => (
                  <div key={participation.id} className="bg-white/10 p-5 rounded-lg shadow-xl text-lg">
                    {participation.video_url && getYouTubeEmbedUrl(participation.video_url) ? (
                      <iframe className="w-full h-[250px] rounded-lg shadow-2xl mb-4" src={getYouTubeEmbedUrl(participation.video_url)} title="Participation Video" frameBorder="0" allowFullScreen></iframe>
                    ) : (
                      <p className="text-red-500">Vidéo introuvable.</p>
                    )}
                    {participation.image_url && (
                      <img src={participation.image_url} alt="Image de participation" className="w-full h-[250px] object-cover rounded-lg shadow-2xl mb-4" />
                    )}
                    <p><strong>Description:</strong> {participation.description}</p>
                    <p><strong>Score:</strong> {participation.score}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-300 text-lg">Aucune participation.</p>
              )}
            </div>
          </details>
        </div>
        <div className="bg-white/10 p-10 rounded-lg shadow-2xl text-lg">
          <h2 className="text-5xl font-semibold mb-4">Description</h2>
          <p className="mb-6 text-3xl">{challenge.description}</p>
          <h2 className="text-5xl font-semibold mb-4">Règles</h2>
          <p className="mb-6 text-3xl">{challenge.rules}</p>
          <div className="mt-10">
            <h3 className="font-semibold mb-4">Commentaires</h3>
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={`${comment.challenge_id}-${comment.account_id}-${comment.created_at}`} className="bg-white/10 p-4 rounded-lg shadow-lg">
                    <p className="font-semibold">{comment.account?.pseudo || "Utilisateur inconnu"}</p>
                    <p>{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-300 text-lg">Aucun commentaire.</p>
              )}
            </div>
            <form onSubmit={handleCommentSubmit} className="mt-6">
              <textarea
                className="w-full border bg-transparent p-4 rounded text-white text-lg"
                placeholder="Ajoutez un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 transition-all duration-500 text-white px-6 py-3 h-14 rounded-lg text-xl font-semibold w-auto mt-5"
              >
                Publier
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChallengePage;
