import { Game, Ranking, Account, Challenge, Vote, Comment, Participate, Badge, Receive, sequelize } from "./index.js";

async function populateDatabase() {
    try {
        console.log("🔄 Début du peuplement de la base de données...");

        // Synchroniser la base de données (Attention: alter:true met à jour sans perte de données)
        await sequelize.sync({ alter: true });

        // 📌 Ajouter des jeux
        const game1 = await Game.create({
            id_game: 101,
            description: "Un FPS ultra rapide.",
            category_game: "FPS",
            genre: "Action",
            title: "ShooterX",
            releaseDate: new Date("2022-06-01"),
        });

        const game2 = await Game.create({
            id_game: 202,
            description: "Un RPG avec un monde ouvert immense.",
            category_game: "RPG",
            genre: "Fantasy",
            title: "Fantasy Quest",
            releaseDate: new Date("2023-04-15"),
        });

        const game3 = await Game.create({
            id_game: 303,
            description: "Un jeu de stratégie au tour par tour.",
            category_game: "STR",
            genre: "Tactique",
            title: "Strategic Master",
            releaseDate: new Date("2024-01-20"),
        });

        const game4 = await Game.create({
            id_game: 404,
            description: "Un jeu de sport ultra réaliste.",
            category_game: "Sport",
            genre: "Simulation",
            title: "RealSport 2024",
            releaseDate: new Date("2024-05-10"),
        });

        const game5 = await Game.create({
            id_game: 505,
            description: "Un jeu de combat en arène.",
            category_game: "Fighting",
            genre: "Action",
            title: "Battle Arena",
            releaseDate: new Date("2023-09-22"),
        });

        // 📌 Ajouter des comptes
        const account1 = await Account.create({
            id_account: 1,
            username: "Player1",
            email: "player1@example.com",
            password: "password123",
            id_rank: 1,  // Référence au classement Bronze
        });

        const account2 = await Account.create({
            id_account: 2,
            username: "Player2",
            email: "player2@example.com",
            password: "password456",
            id_rank: 2,  // Référence au classement Silver
        });

        const account3 = await Account.create({
            id_account: 3,
            username: "Player3",
            email: "player3@example.com",
            password: "password789",
            id_rank: 3,  // Référence au classement Gold
        });

        const account4 = await Account.create({
            id_account: 4,
            username: "Player4",
            email: "player4@example.com",
            password: "password101",
            id_rank: 4,  // Référence au classement Platinum
        });

        // 📌 Ajouter des challenges
        const challenge1 = await Challenge.create({
            id_challenge: 1,
            title: "Treasure Hunt",
            description: "Find the hidden treasure in Game A.",
            difficulty: "Medium",
            rewardPoints: 150,
            id_game: 101,
            id_account: 1,
        });

        const challenge2 = await Challenge.create({
            id_challenge: 2,
            title: "Mastermind Puzzle",
            description: "Solve the hardest puzzle in Game B.",
            difficulty: "Hard",
            rewardPoints: 250,
            id_game: 202,
            id_account: 2,
        });

        const challenge3 = await Challenge.create({
            id_challenge: 3,
            title: "Epic Battle",
            description: "Defeat the dragon boss in Game C.",
            difficulty: "Very Hard",
            rewardPoints: 500,
            id_game: 303,
            id_account: 3,
        });

        const challenge4 = await Challenge.create({
            id_challenge: 4,
            title: "Speed Run",
            description: "Finish the game in the fastest time possible.",
            difficulty: "Easy",
            rewardPoints: 100,
            id_game: 404,
            id_account: 4,
        });

        // 📌 Ajouter des votes
        await Vote.create({ id_account: 1, id_challenge: 2 });
        await Vote.create({ id_account: 2, id_challenge: 1 });
        await Vote.create({ id_account: 3, id_challenge: 4 });
        await Vote.create({ id_account: 4, id_challenge: 3 });

        // 📌 Ajouter des commentaires
        await Comment.create({
            id_account: 1,
            id_challenge: 1,
            content: "This was a fun treasure hunt! Loved the challenge!",
        });

        await Comment.create({
            id_account: 2,
            id_challenge: 2,
            content: "This puzzle is insanely hard! Took me hours to solve.",
        });

        await Comment.create({
            id_account: 3,
            id_challenge: 3,
            content: "The dragon battle was epic! I barely survived.",
        });

        await Comment.create({
            id_account: 4,
            id_challenge: 4,
            content: "The speed run was easy, but exciting nonetheless!",
        });

        // 📌 Ajouter des participations
        await Participate.create({ id_account: 1, id_challenge: 3 });
        await Participate.create({ id_account: 2, id_challenge: 1 });
        await Participate.create({ id_account: 3, id_challenge: 4 });
        await Participate.create({ id_account: 4, id_challenge: 2 });

        // 📌 Ajouter des badges
        const badge1 = await Badge.create({
            id_badge: 1,
            name: "Explorer",
            description: "Awarded for completing the Treasure Hunt challenge.",
        });

        const badge2 = await Badge.create({
            id_badge: 2,
            name: "Puzzle Master",
            description: "Awarded for solving the Mastermind Puzzle.",
        });

        const badge3 = await Badge.create({
            id_badge: 3,
            name: "Dragon Slayer",
            description: "Awarded for defeating the Dragon Boss in Epic Battle.",
        });

        const badge4 = await Badge.create({
            id_badge: 4,
            name: "Speedster",
            description: "Awarded for completing the Speed Run challenge.",
        });

        // 📌 Ajouter des réceptions de badges
        await Receive.create({ id_account: 1, id_badge: 1 });
        await Receive.create({ id_account: 2, id_badge: 2 });
        await Receive.create({ id_account: 3, id_badge: 3 });
        await Receive.create({ id_account: 4, id_badge: 4 });

        console.log("✅ Base de données peuplée avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors du peuplement :", error);
    } finally {
        await sequelize.close();
    }
}

// Exécuter le script
populateDatabase();
