import { sequelize } from "./sequelize-client.js";
import { Game, Account, Challenge, Vote, Comment, Participate, Badge, Receive, RefreshToken } from "./associations.js";

console.log("📌 Vérification des modèles importés :", {
    Game, Account, Challenge, Vote, Comment, Participate, Badge, Receive, RefreshToken
});

// J'exporte également le client sequelize, on en aura besoin ;-)
export { Game, Account, Challenge, Vote, Comment, Participate, Badge, Receive, RefreshToken, sequelize };
