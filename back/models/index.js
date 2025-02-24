import { sequelize } from "./sequelize-client.js";
import { Game, Account, Challenge, Vote, Comment, Participate, Badge, Receive, Category, RefreshToken } from "./associations.js";

console.log("📌 Vérification des modèles importés :", {
    Game, Account, Challenge, Vote, Comment, Participate, Badge, Receive, RefreshToken
});

export { Game, Account, Challenge, Vote, Comment, Participate, Badge, Receive, Category, RefreshToken, sequelize };
