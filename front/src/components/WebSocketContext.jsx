// WebSocketContext.jsx
import { createContext, useEffect, useState } from "react";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("✅ Connecté au serveur WebSocket");
      const defaultMessage = { username: "Serveur", message: "Hello, serveur !" };
      ws.send(JSON.stringify(defaultMessage));
    };

    ws.onmessage = (event) => {
      try {
        const chatMessage = JSON.parse(event.data);
        console.log("📩 Message brut reçu :", chatMessage);
        setMessages((prev) => [...prev, chatMessage]);
      } catch (error) {
        console.error("❌ Erreur lors du parsing du message :", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ Erreur WebSocket :", error);
    };

    ws.onclose = () => {
      console.log("🔴 Déconnecté du serveur WebSocket");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};
