import { useContext, useState } from "react";
import { WebSocketContext } from "./WebSocketContext"; // Vérifie le chemin

const Chat = () => {
  const { socket, messages } = useContext(WebSocketContext);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  const sendMessage = () => {
    if (!socket) {
      console.error("❌ WebSocket non initialisé !");
      return;
    }
    if (socket.readyState !== WebSocket.OPEN) {
      console.error(`⚠️ WebSocket pas encore connecté ! État actuel : ${socket.readyState}`);
      return;
    }

    if (username.trim() === "") {
      alert("Veuillez entrer un nom d'utilisateur !");
      return; // Empêche l'envoi si le nom d'utilisateur est vide
    }

    if (message.trim() === "") {
      alert("Veuillez entrer un message !");
      return; // Empêche l'envoi de messages vides
    }

    // Envoie un message sous forme d'objet contenant le nom d'utilisateur et le message
    const chatMessage = { username, message };
    socket.send(JSON.stringify(chatMessage));
    setMessage("");
  };

  return (
    <div className="bg-black text-[#9F8B20] p-4 rounded-lg flex flex-col shadow-lg">
      {/* Zone pour entrer le nom d'utilisateur */}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border border-[#9F8B20] bg-gray-800 rounded-lg p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-[#9F8B20]"
        placeholder="Entrez votre nom d'utilisateur"
      />

      <div className="h-60 overflow-auto bg-gray-800 rounded-lg p-2 mb-2 border border-[#9F8B20]">
        {messages.map((msg, index) => (
          <p key={index} className="text-sm text-[#9F8B20]">
            <strong>{msg.username}:</strong> {msg.message}
          </p>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-[#9F8B20] bg-gray-800 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#9F8B20]"
          placeholder="Tapez votre message ici..."
        />
        <button
          onClick={sendMessage}
          disabled={!socket || socket.readyState !== WebSocket.OPEN}
          className="ml-2 bg-[#9F8B20] text-black rounded-lg px-4 py-2 hover:bg-[#8B7B1A] disabled:bg-gray-400"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default Chat;
