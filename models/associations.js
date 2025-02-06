import { Game } from "./game.js";
import { Account } from "./account.js";
import { Challenge } from "./challenge.js";
import { Vote } from "./vote.js";
import { Comment } from "./comment.js";
import { Participate } from "./participate.js";
import { Badge } from "./badge.js";
import { Receive } from "./receive.js";

// One-To-One : hasOne + belongsTo
// One-To-Many : hasMany + belongsTo
// Many-To-Many : belongsToMany + belongsToMany

// Game <-> Challenge (One-to-Many)
Game.hasMany(Challenge, { as: "challenges", foreignKey: "id_game", onDelete: "CASCADE" });
Challenge.belongsTo(Game, { as: "game", foreignKey: "id_game" });

// Account <-> Challenge (One-to-Many)
Account.hasMany(Challenge, { as: "challenges", foreignKey: "id_account", onDelete: "CASCADE" });
Challenge.belongsTo(Account, { as: "account", foreignKey: "id_account" });

// Account <-> Vote <-> Challenge (Many-to-Many)
Account.belongsToMany(Challenge, { as: "votedChallenges", through: "vote", foreignKey: "id_account", otherKey: "id_challenge" });
Challenge.belongsToMany(Account, { as: "voters", through: "vote", foreignKey: "id_challenge", otherKey: "id_account" });

// Account <-> Comment <-> Challenge (Many-to-Many)
Account.belongsToMany(Challenge, { as: "commentedChallenges", through: "comment", foreignKey: "id_account", otherKey: "id_challenge" });
Challenge.belongsToMany(Account, { as: "commenters", through: "comment", foreignKey: "id_challenge", otherKey: "id_account" });

// Account <-> Participate <-> Challenge (Many-to-Many)
Account.belongsToMany(Challenge, { as: "participatedChallenges", through: "participate", foreignKey: "id_account", otherKey: "id_challenge" });
Challenge.belongsToMany(Account, { as: "participants", through: "participate", foreignKey: "id_challenge", otherKey: "id_account" });

// Account <-> Receive <-> Badge (Many-to-Many)
Account.belongsToMany(Badge, { as: "badges", through: "receive", foreignKey: "id_account", otherKey: "id_badge" });
Badge.belongsToMany(Account, { as: "owners", through: "receive", foreignKey: "id_badge", otherKey: "id_account" });

export { Game, Ranking, Account, Challenge, Vote, Comment, Participate, Badge, Receive };
