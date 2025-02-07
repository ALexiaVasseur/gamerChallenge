import { Game } from "./game.js";
import { Account } from "./account.js";
import { Challenge } from "./challenge.js";
import { Vote } from "./vote.js";
import { Comment } from "./comment.js";
import { Participate } from "./participate.js";
import { Badge } from "./badge.js";
import { Receive } from "./receive.js";

// Vérification des imports
console.log("📌 Vérification des modèles avant associations :", {
  Game, Account, Challenge, Vote, Comment, Participate, Badge, Receive
});

// Game <-> Challenge (One-to-Many)
Game.hasMany(Challenge, { foreignKey: "id", onDelete: "CASCADE" });
Challenge.belongsTo(Game, { foreignKey: "id" });

// Account <-> Challenge (One-to-Many)
Account.hasMany(Challenge, { foreignKey: "id", onDelete: "CASCADE" });
Challenge.belongsTo(Account, { foreignKey: "id" });

// Account <-> Vote <-> Participate (Many-to-Many via Vote)
Account.hasMany(Vote, { foreignKey: "id", onDelete: "CASCADE" });
Vote.belongsTo(Account, { foreignKey: "id" });

Participate.hasMany(Vote, { foreignKey: "id_participation", onDelete: "CASCADE" });
Vote.belongsTo(Participate, { foreignKey: "id_participation" });

// Account <-> Comment <-> Challenge (Many-to-Many via Comment)
Account.hasMany(Comment, { foreignKey: "id", onDelete: "CASCADE" });
Comment.belongsTo(Account, { foreignKey: "id" });

Challenge.hasMany(Comment, { foreignKey: "id", onDelete: "CASCADE" });
Comment.belongsTo(Challenge, { foreignKey: "id" });

// Account <-> Participate <-> Challenge (Many-to-Many via Participate)
Account.hasMany(Participate, { foreignKey: "id", onDelete: "CASCADE" });
Participate.belongsTo(Account, { foreignKey: "id" });

Challenge.hasMany(Participate, { foreignKey: "id", onDelete: "CASCADE" });
Participate.belongsTo(Challenge, { foreignKey: "id" });

// Account <-> Receive <-> Badge (Many-to-Many via Receive)
Account.hasMany(Receive, { foreignKey: "id_account", onDelete: "CASCADE" });
Receive.belongsTo(Account, { foreignKey: "id_account" });

Badge.hasMany(Receive, { foreignKey: "id_badge", onDelete: "CASCADE" });
Receive.belongsTo(Badge, { foreignKey: "id_badge" });

export { Game, Account, Challenge, Vote, Comment, Participate, Badge, Receive };
