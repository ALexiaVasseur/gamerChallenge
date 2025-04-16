import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ModalParticipation from "../components/ModalParticipation";
import { FaStar, FaRegStar } from "react-icons/fa";

const ChallengePage = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [comments, setComments] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [votes, setVotes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [connected, setConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;
  const [isFullScreen, setIsFullScreen] = useState(false);
  const openFullScreen = () => setIsFullScreen(true);
  const closeFullScreen = () => setIsFullScreen(false);
  const apiUrl = import.meta.env.VITE_API_URL; // Utilise la variable d'environnement



  const getYouTubeEmbedUrl = (url) => {
    const match = url.match(/(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  useEffect(() => {
    window.dispatchEvent(new Event("userChanged"));
    const userData = localStorage.getItem("user");
    if (userData) {
      setConnected(true);
    }
  }, []);


  useEffect(() => {
    const fetchChallengeData = async () => {
      setLoading(true);
      try {
        const [challengeResponse, commentsResponse, participationsResponse, votesResponse] = await Promise.all([
        fetch(`${apiUrl}/api/challenge/${id}`),
        fetch(`${apiUrl}/api/challenges/${id}/comments`),
        fetch(`${apiUrl}/api/participations/${id}`),
        fetch(`${apiUrl}/api/challenge/${id}/votes`),
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

        if (votesResponse.ok) {
          const votesData = await votesResponse.json();
          setVotes(votesData);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallengeData();
  }, [id,apiUrl]);

  useEffect(() => {
    if (!isModalOpen) {
      const fetchParticipations = async () => {
        try {
          const response = await fetch(`${apiUrl}/api/participations/${id}`);
          if (response.ok) {
            const participationsData = await response.json();
            setParticipations(participationsData);
          }
        } catch (error) {
          console.error("Erreur lors du rafraîchissement des participations:", error);
        }
      };

      fetchParticipations();
    }
  }, [isModalOpen, id, apiUrl]);


  const calculateAverageVote = () => {
    if (votes.length === 0) return 0; 
    const totalVotes = votes.reduce((acc, vote) => acc + vote.vote, 0);
    return totalVotes / votes.length;
  };


  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
  
    const challengeId = parseInt(id, 10);
    const accountId = userId; 
  
    try {
      const response = await fetch(`${apiUrl}/api/challenge/${challengeId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({
          challenge_id: challengeId,
          text: newComment,
          account_id: accountId,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.message === "Vous avez déjà commenté ce défi.") {
          setError(errorData.message); 
          return;
        }
  
        if (errorData.message === "Token manquant, veuillez vous connecter.") {
          localStorage.removeItem("user")
        }

        console.error("Erreur lors de l'ajout du commentaire:", errorData);
        throw new Error(errorData.message || "Erreur inconnue");

      }
  
      const addedComment = await response.json();
      setComments([...comments, addedComment]);
      setNewComment("");
    } catch (error) {
      console.error("Erreur lors de la soumission du commentaire:", error.message);
      setError(error.message);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleParticipationSubmit = async () => {
    try {
      const participationResponse = await fetch(`${apiUrl}/api/participations/${id}`);
      if (participationResponse.ok) {
        const participationData = await participationResponse.json();
        setParticipations(participationData);
      }

      const votesResponse = await fetch(`${apiUrl}/api/challenge/${id}/votes`);
      if (votesResponse.ok) {
        const votesData = await votesResponse.json();
        setVotes(votesData);
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des participations et votes:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500 text-2xl">Chargement...</p>;
  if (error) return <p className="text-center text-red-500 text-2xl">{error}</p>;
  if (!challenge) return <p className="text-center text-gray-500 text-2xl">Challenge introuvable.</p>;

  return (
    <main className="mx-auto p-6 md:p-12 text-white">
      <div className="w-full flex justify-center">
        {challenge.image_url ? (
          <img
            src={challenge.image_url}
            alt="Challenge Image"
            className="w-full max-w-[600px] h-auto max-h-[400px] object-cover rounded-lg shadow-2xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/path/to/default-image.png";
            }}
          />
        ) : (
          <div className="w-full max-w-[600px] h-[400px] flex items-center justify-center bg-gray-800 rounded-lg shadow-2xl">
            <p className="text-white text-xl font-semibold">No Image</p>
          </div>
        )}
      </div>

      <h1 className="text-5xl font-bold text-center mt-6 mb-6">{challenge.title}</h1>
      {challenge.account && (
        <p className="text-center text-lg text-gray-400 mb-6">
          Créé par: <strong>{challenge.account.pseudo}</strong>
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
        {challenge.game?.game_url && ( 
  <div className="relative">
    <iframe
      className="w-full max-w-[960px] h-[400px] rounded-lg shadow-2xl mx-auto"
      src={challenge.game.game_url}
      title="Jeu du challenge"
      frameBorder="0"
      allowFullScreen
    />
    <button 
      onClick={openFullScreen}
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-lg text-xl font-bold transition-all hover:bg-black"
    >
      🔎 Plein écran
    </button>
  </div>
)}

{isFullScreen && (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
    <div className="relative w-full h-full">
      <button 
        onClick={closeFullScreen}
        className="absolute top-8 right-8 bg-red-600 text-white px-6 py-3 rounded-lg text-2xl font-bold transition-all hover:bg-red-700"
      >
        ❌ Fermer et revenir sur GamerChallenge
      </button>
      <iframe
        className="w-full h-full"
        src={challenge.game.game_url}
        title="Jeu en plein écran"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  </div>
)}




          <details className="mt-10 bg-white/10 p-5 rounded-lg">
            <summary className="cursor-pointer text-3xl font-semibold">Voir les participations</summary>
            <div className="max-h-[500px] overflow-y-auto space-y-6 mt-4">
              {participations.length > 0 ? (
                participations.map((participation) => (
                  <div key={participation.id} className="bg-white/10 p-5 rounded-lg shadow-xl text-lg">
                    {participation.video_url && getYouTubeEmbedUrl(participation.video_url) ? (
                      <iframe 
                        className="w-full h-[250px] rounded-lg shadow-2xl mb-4" 
                        src={getYouTubeEmbedUrl(participation.video_url)} 
                        title="Participation Video" 
                        frameBorder="0" 
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <p className="text-red-500">Vidéo introuvable.</p>
                    )}

                    {participation.image_url && (
                      <img src={participation.image_url} alt="Image de participation" className="w-full h-[250px] object-cover rounded-lg shadow-2xl mb-4" />
                    )}

                    <p><strong>Pseudo:</strong> {participation.account?.pseudo}</p>
                    <p><strong>Description:</strong> {participation.description}</p>
                    <p><strong>Score:</strong> {participation.account?.score_global}</p>

                    <p><strong>Votes :</strong></p>
                    <div className="flex text-text-[#9f8b20]">
                      {[...Array(Math.floor(participation.votes[0]?.vote || 0))].map((_, i) => <FaStar key={`full-${i}`} className="text-[#9f8b20]" />)} 
                      {participation.votes[0]?.vote % 1 >= 0.5 && <FaStar key="half" className="text-[#9f8b20] opacity-50" />}
                      {[...Array(5 - Math.floor(participation.votes[0]?.vote || 0) - (participation.votes[0]?.vote % 1 >= 0.5 ? 1 : 0))].map((_, i) => <FaRegStar key={`empty-${i}`} className="text-gray-400" />)}
                    </div>
                    
                  </div>
                ))
              ) : (
                <p className="text-gray-300 text-lg">Aucune participation.</p>
              )}
            </div>
          </details>
        </div>

        <div className="bg-white/10 p-10 rounded-lg shadow-2xl text-lg">
          
          <div className="flex justify-end items-center space-x-1">
  {[...Array(Math.floor(calculateAverageVote()))].map((_, i) => (
    <FaStar key={`full-${i}`} className="text-[#9f8b20] text-4xl" /> 
  ))}
  {calculateAverageVote() % 1 >= 0.5 && (
    <FaStar key="half" className="text-[#9f8b20]-400 opacity-50 text-4xl" />
  )}
  {[...Array(5 - Math.floor(calculateAverageVote()) - (calculateAverageVote() % 1 >= 0.5 ? 1 : 0))].map((_, i) => (
    <FaRegStar key={`empty-${i}`} className="text-gray-400 text-4xl" /> 
  ))}
</div>

{challenge.game?.thumbnail ? (
  <div className="w-full flex justify-center my-8">
    <img
      src={challenge.game.thumbnail}
      alt="Thumbnail du jeu"
      className="w-full max-w-[500px] h-auto max-h-[400px] object-cover rounded-lg shadow-lg"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "/path/to/default-thumbnail.png"; // Image de secours
      }}
    />
  </div>
) : (
  <p className="text-center text-gray-400 text-lg my-4">Aucune image disponible.</p>
)}



          <h2 className="text-3xl md:text-3xl font-bold mb-5">Description</h2>
          <p className="mb-6 text-1xl">{challenge.description}</p>

          <h2 className="text-3xl md:text-3xl font-bold mb-5">Règles</h2>
          <p className="mb-6 text-1xl">{challenge.rules}</p>
          {connected && (
            <button
            onClick={openModal}
            className="w-full sm:w-auto bg-[rgba(159,139,32,0.7)] hover:bg-[rgba(159,139,32,1)] transition-all duration-500 text-white px-4 py-3 rounded-lg text-lg font-semibold"
            >
              Publier ma participation
            </button>
          )}
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
            {connected && (
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
                  className="bg-[rgba(159,139,32,0.7)] hover:bg-[rgba(159,139,32,1)] transition-all duration-500 text-white px-6 py-3 h-14 rounded-lg text-xl font-semibold w-auto mt-5"
                >
                  Publier
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <ModalParticipation isOpen={isModalOpen} onClose={closeModal} challengeId={challenge.id} onSubmit={handleParticipationSubmit} />
    </main>
  );
};

export default ChallengePage;
