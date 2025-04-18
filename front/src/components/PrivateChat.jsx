import { useState, useEffect } from "react";
import { WebSocketProvider } from "./WebSocketContext";
import Chat from "./Chat";

const PrivateChat = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false); // État pour gérer l'ouverture de la fenêtre de chat
  const apiUrl = import.meta.env.VITE_API_URL;  // Utilisation de la variable d'environnement
  const token = localStorage.getItem("token");

  // Vérification de l'authentification au chargement du composant
  useEffect(() => {
    // Essayer de vérifier l'authentification via une requête
    fetch(`${apiUrl}/chat`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      credentials: 'include' 
      }// Cela permettra d'envoyer les cookies
    })
    .then(response => {
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setError("Utilisateur non authentifié.");
      }
    })
    .catch(err => {
      setError("Erreur lors de la vérification de l'authentification : " + err.message);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [apiUrl, token]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="relative">
      <button
  onClick={() => setIsChatOpen(true)} // Ouvrir la fenêtre de chat
  className="fixed bottom-10 right-10 bg-[#9F8B20] text-white font-bold p-2 rounded-lg hover:bg-[#8B7B1A] z-50"
>
  Ouvrir le chat
</button>



      {isChatOpen && (
        <div className="fixed bottom-0 right-0 w-96 bg-black text-white rounded-lg shadow-lg z-50">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">Chat</h2>
            <button
              onClick={() => setIsChatOpen(false)} // Fermer la fenêtre de chat
              className="text-gray-400 hover:text-white z-50" // Assurez-vous que le z-index est élevé
              style={{ zIndex: 100 }} // Assurez-vous que le z-index est bien supérieur
            >
              &times; {/* Utilisation de la croix pour fermer */}
            </button>
          </div>
          <WebSocketProvider>
            {isAuthenticated ? <Chat /> : <p>Connectez-vous pour discuter.</p>}
          </WebSocketProvider>
        </div>
      )}
    </div>
  );
};

export default PrivateChat;
