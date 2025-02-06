import { sequelize } from "../models/index.js"; // sequelize est "conscient" de nos modèles

// Suppression des tables
await sequelize.drop();

// Création des tables
await sequelize.sync(); // synchroniser toutes les tables associés à ce tunnel de connexion

// On close la connexion
await sequelize.close();
console.log("✅ GamerChallenge tables created with success!");