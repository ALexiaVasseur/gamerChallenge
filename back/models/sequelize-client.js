import "dotenv/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.PG_URL, {
  logging: false,
  define: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  dialectOptions: {
    ssl: {
      require: true, // Indique qu'une connexion SSL est nécessaire
      rejectUnauthorized: false, // Permet d'ignorer les erreurs de certificat SSL
    },
  },
});
