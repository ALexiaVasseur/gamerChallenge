/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
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

  // Fonction pour transformer l'URL YouTube en un lien d'embed
  const getYouTubeEmbedUrl = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|(?:[^a-z0-9]|^)v=)([a-zA-Z0-9_-]{11})/
    );
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  };

  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        const challengeResponse = await fetch(`http://localhost:3000/api/challenge/${id}`);
        if (!challengeResponse.ok) throw new Error("Challenge introuvable");
        const challengeData = await challengeResponse.json();
        setChallenge(challengeData);

        const commentsResponse = await fetch(`http://localhost:3000/api/comments?challengeId=${id}`);
        if (!commentsResponse.ok) throw new Error("Commentaires introuvables");
        const commentsData = await commentsResponse.json();
        setComments(commentsData);

        // Récupérer les participations associées au challenge
        const participationsResponse = await fetch(`http://localhost:3000/api/participations/${id}`);
        if (!participationsResponse.ok) throw new Error("Participations introuvables");
        const participationsData = await participationsResponse.json();
        setParticipations(participationsData);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallengeData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:3000/api/challenge/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout du commentaire");

      const newCommentData = await response.json();
      setComments([...comments, newCommentData]);
      setNewComment("");
    } catch (error) {
      setError("Impossible d'ajouter le commentaire.");
    }
  };

  if (loading) return <p className="text-center text-gray-500 text-2xl">Chargement...</p>;
  if (error) return <p className="text-center text-red-500 text-2xl">{error}</p>;
  if (!challenge) return <p className="text-center text-gray-500 text-2xl">Challenge introuvable.</p>;

  return (
    <main className="mx-auto p-12 text-white">
      {/* Titre Centré */}
      <h1 className="text-6xl font-bold text-center mt-12 mb-10">{challenge.title}</h1>

      {/* Contenu principal en grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Colonne principale: Vidéo + Participations */}
        <div className="lg:col-span-2">
          {/* Vidéo YouTube */}
          {challenge.video_url && (
            <iframe
              className="w-full h-[500px] rounded-lg shadow-2xl"
              src={getYouTubeEmbedUrl(challenge.video_url)}
              title="Challenge Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          )}

          {/* Participations sous la vidéo */}
          <section className="mt-10">
            <h2 className="text-3xl font-semibold mb-6">Participations</h2>
            <div className="space-y-6">
              {participations.length > 0 ? (
                participations.map((participation) => (
                  <div
                    key={participation.id}
                    className="bg-white/10 backdrop-blur-lg border border-white p-5 rounded-lg shadow-xl text-lg"
                  >
                    {/* Vidéo et Image de participation */}
                    {participation.video_url && getYouTubeEmbedUrl(participation.video_url) ? (
                      <iframe
                        className="w-full h-[400px] rounded-lg shadow-2xl mb-4"
                        src={getYouTubeEmbedUrl(participation.video_url)}
                        title="Participation Video"
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <p className="text-red-500">Vidéo introuvable ou URL invalide.</p>
                    )}

                    {participation.image_url && (
                      <img
                        src={participation.image_url}
                        alt="Image de participation"
                        className="w-full h-[400px] object-cover rounded-lg shadow-2xl mb-4"
                      />
                    )}

                    {/* Description et Score */}
                    <p><strong>Description:</strong> {participation.description}</p>
                    <p><strong>Score:</strong> {participation.score}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-300 text-lg">Aucune participation pour ce challenge.</p>
              )}
            </div>
          </section>
        </div>

        {/* Colonne secondaire: Description, règles et commentaires */}
        <div className="bg-white/10 backdrop-blur-lg p-10 rounded-lg shadow-2xl text-lg w-full flex flex-col">
          <h2 className="text-5xl font-semibold mb-4">Description</h2>
          <p className="mb-6 text-3xl">{challenge.description}</p>
          <h2 className="text-5xl font-semibold mb-4">Règles</h2>
          <p className="mb-6 text-3xl">{challenge.rules}</p>

          {/* Commentaires sous la description */}
          <div className="mt-10 space-y-4">
            <h3 className="font-semibold mb-4">Commentaires</h3>
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-white/10 backdrop-blur-lg p-4 rounded-lg shadow-lg">
                    <p className="font-semibold">{comment.account?.pseudo || "Utilisateur inconnu"}</p>
                    <p>{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-300 text-lg">Aucun commentaire pour l&apos;instant.</p>
              )}
            </div>

            {/* Formulaire de commentaire */}
            <form onSubmit={handleCommentSubmit} className="mt-6">
              <textarea
                className="w-full border border-white bg-transparent p-4 rounded text-white text-lg"
                placeholder="Ajoutez un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <button type="submit" className="bg-[#FF8C00] hover:bg-orange-600 transition-all duration-500 text-white px-6 py-3 h-14 rounded-lg text-xl font-semibold w-auto mt-5">
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
