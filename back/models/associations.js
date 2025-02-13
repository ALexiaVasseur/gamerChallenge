import { Game } from "./game.js";
import { Account } from "./account.js";
import { Challenge } from "./challenge.js";
import { Vote } from "./vote.js";
import { Comment } from "./comment.js";
import { Participate } from "./participate.js";
import { Badge } from "./badge.js";
import { Receive } from "./receive.js";
import { RefreshToken } from "./refreshToken.js";
// Doc : https://sequelize.org/docs/v6/core-concepts/assocs/
// One-To-One : hasOne + belongsTo
// One-To-Many : hasMany + belongsTo
// Many-To-Many : belongsToMany + belongsToMany

// User <-> RefreshToken (One-To-Many)
Account.hasMany(RefreshToken, {
  foreignKey: "userId", 
  as: "refreshToken" 
});
RefreshToken.belongsTo(Account, { 
  foreignKey: "userId", 
  as: "user" 
});


// Game <-> Challenge (One-to-Many)
Game.hasMany(Challenge, {
  as: "challenges", // Quand je demande un game, je veux récupérer "ses challenges"
  foreignKey: "game_id",
  onDelete: "CASCADE"
});
Challenge.belongsTo(Game, {
  as: "game",
  foreignKey: "game_id"
});

// Account <-> Challenge (One-to-Many)
Account.hasMany(Challenge, {
  as: "challenges", // Quand je demande un account, je veux récupérer "ses challenges"
  foreignKey: "account_id",
  onDelete: "CASCADE"
});
Challenge.belongsTo(Account, {
  as: "account",
  foreignKey: "account_id"
});

// Account <-> Vote <-> Participate (Many-to-Many via Vote)
Account.hasMany(Vote, {
  as: "votes",
  foreignKey: "account_id",
  onDelete: "CASCADE"
});
Vote.belongsTo(Account, {
  as: "account",
  foreignKey: "account_id"
});

Participate.hasMany(Vote, {
  as: "votes",
  foreignKey: "participation_id",
  onDelete: "CASCADE"
});
Vote.belongsTo(Participate, {
  as: "participate",
  foreignKey: "participation_id"
});

// Account <-> Comment <-> Challenge (Many-to-Many via Comment)
Account.hasMany(Comment, {
  as: "comments",
  foreignKey: "account_id",
  onDelete: "CASCADE"
});
Comment.belongsTo(Account, {
  as: "account",
  foreignKey: "account_id"
});

Challenge.hasMany(Comment, {
  as: "comments",
  foreignKey: "challenge_id",
  onDelete: "CASCADE"
});
Comment.belongsTo(Challenge, {
  as: "challenge",
  foreignKey: "challenge_id"
});

// Account <-> Participate <-> Challenge (Many-to-Many via Participate)
Account.hasMany(Participate, {
  as: "participations",
  foreignKey: "account_id",
  onDelete: "CASCADE"
});
Participate.belongsTo(Account, {
  as: "account",
  foreignKey: "account_id"
});

Challenge.hasMany(Participate, {
  as: "participations",
  foreignKey: "challenge_id",
  onDelete: "CASCADE"
});
Participate.belongsTo(Challenge, {
  as: "challenge",
  foreignKey: "challenge_id"
});

// Account <-> Receive <-> Badge (Many-to-Many via Receive)
Account.hasMany(Receive, {
  as: "receivedBadges",
  foreignKey: "account_id",
  onDelete: "CASCADE"
});
Receive.belongsTo(Account, {
  as: "account",
  foreignKey: "account_id"
});

Badge.hasMany(Receive, {
  as: "receives",
  foreignKey: "badge_id",
  onDelete: "CASCADE"
});
Receive.belongsTo(Badge, {
  as: "badge",
  foreignKey: "badge_id"
});

export { Game, Account, Challenge, Vote, Comment, Participate, Badge, Receive, RefreshToken };
