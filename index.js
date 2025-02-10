import express from 'express';
import "dotenv/config";
import cors from "cors";
import cookieParser from 'cookie-parser';
import config from "./config.js";
import { router as apiRouter } from "./routers/index.js";
import { notFoundMiddleware, errorHandler } from "./middlewares/index.middleware.js";

const app = express();
console.log(process.env.PORT)

app.use(cors({
  origin: (origin, callback) => {
    const allowedDomains = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://192.168.91.58:5173" // Vérifie bien que le port est bon
    ];

    if (!origin || allowedDomains.includes(origin)) {
      callback(null, origin); // Retourne l'origine spécifique
    } else {
      callback(new Error("CORS non autorisé"));
    }
  }, // Allow cross-origin requests
  credentials: config.server.cors.credentials // Allow cross-origin cookies to be sent
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use("/api", apiRouter);

// Not found middleware
app.use(notFoundMiddleware);

// Error middleware
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`);
});
