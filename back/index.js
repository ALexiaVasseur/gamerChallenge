import express from 'express';
import "dotenv/config";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { router as apiRouter } from "./routers/index.js";
import { notFoundMiddleware, errorHandler } from "./middlewares/index.middleware.js";
import { WebSocketServer } from 'ws';
import http from "http";
import { logger } from './lib/logger.js';
import path from 'path';

const app = express();
const server = http.createServer(app); // Création du serveur HTTP pour WebSocket

// Configuration du WebSocket avec vérification de l'origine
const wss = new WebSocketServer({
  server,
  verifyClient: (info, done) => {
    // Liste des origines autorisées
    const allowedOrigins = [
      "http://localhost:5173",  // Local Dev
      "http://127.0.0.1:5173",  // Local Dev
      "https://gamerchallenge-frontend.onrender.com", // Production
      "ws://localhost:3000",  // WebSocket local (Dev)
      "wss://gamerchallenge.onrender.com", // WebSocket Production
    ];

    const origin = info.origin || info.headers.origin; // Récupère l'origine de la requête

    if (allowedOrigins.includes(origin)) {
      done(true); // Autorise la connexion si l'origine est dans la liste
    } else {
      done(false, 403, "CORS non autorisé"); // Refuse la connexion avec une erreur 403 si l'origine est non autorisée
    }
  }
});

wss.on("connection", (ws) => {
  console.log("🟢 Nouveau client connecté");

  ws.on("message", (message) => {
    try {
      const chatMessage = JSON.parse(message); // Parse le message reçu

      console.log(`📩 Message reçu de ${chatMessage.username}: ${chatMessage.message}`);

      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify(chatMessage));
        }
      });
    } catch (error) {
      console.error("❌ Erreur lors du traitement du message :", error);
    }
  });

  ws.on("close", (code, reason) => {
    console.log(`🔴 Client déconnecté (Code: ${code}, Raison: ${reason})`);
  });

  ws.on("error", (error) => {
    console.error("❌ Erreur WebSocket :", error);
  });
});

app.use(cookieParser());

app.use(cors({
  origin: (origin, callback) => {
    const allowedDomains = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://192.168.91.58:5173",
      "http://192.168.92.107:5173",
      "http://172.18.0.4:4173",
      "http://localhost:4173",
      "http://192.168.91.196:5173",
      "http://192.168.91.196:5173",
      "https://gamerchallenge-frontend.onrender.com",
      "http://192.168.94.154:5173"
    ];

    if (!origin || allowedDomains.includes(origin) || origin === "null") {
      callback(null, true);
    } else {
      callback(new Error("CORS non autorisé"));
    }
  },
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ton API Router ici
app.use("/api", apiRouter);

// Middleware de gestion des erreurs
app.use(notFoundMiddleware);  // Gère les routes non trouvées
app.use(errorHandler);         // Gère les erreurs (NotFoundError et autres)

// Servir les fichiers statiques (frontend)
app.use(express.static(path.join(__dirname, 'build')));

// Gérer toutes les autres requêtes pour rediriger vers index.html (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Démarrer le serveur
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`);
});
