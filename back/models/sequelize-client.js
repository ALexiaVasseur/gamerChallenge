import "dotenv/config";
import { Sequelize } from "sequelize";

// Ajout du log pour vérifier la variable d'environnement PG_URL
console.log("PG_URL:", process.env.PG_URL);  // Ceci affichera la valeur de PG_URL dans la console

export const sequelize = new Sequelize(process.env.PG_URL, {
  logging: false,
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
});
