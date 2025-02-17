import express from 'express';
import "dotenv/config";
import cors from "cors";
import cookieParser from 'cookie-parser';
import config from "./config.js";
import { router as apiRouter } from "./routers/index.js";
import { notFoundMiddleware, errorHandler } from "./middlewares/index.middleware.js";

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    console.log("🔍 Origine de la requête :", origin); // Pour le débogage
    const allowedDomains = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://192.168.91.58:5173",
      "http://192.168.92.107:5173",
      "http://172.18.0.4:4173",
      "http://localhost:4173",
    ];

    if (!origin || allowedDomains.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("CORS non autorisé"));
    }
  },
  credentials: config.server.cors.credentials
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
