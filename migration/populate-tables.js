import { Game, Account, Challenge, Vote, Comment, Participate, Badge, Receive, sequelize } from "../models/index.js";

async function populateDatabase() {
    try {
        console.log("🔄 Starting database population...");

        // Synchroniser les modèles et forcer la réinitialisation des tables
        await sequelize.sync({ alter: true }); // Utilise force: true pour supprimer et recréer les tables
        
        // 📌 Add accounts
        const accounts = await Account.bulkCreate([
            { pseudo: "PlayerOne", email: "player1@example.com", password: "hashedpassword1", score_global: 0, role: "user", is_active: true },
            { pseudo: "PlayerTwo", email: "player2@example.com", password: "hashedpassword2", score_global: 0, role: "user", is_active: true },
            { pseudo: "PlayerThree", email: "player3@example.com", password: "hashedpassword3", score_global: 0, role: "user", is_active: true },
            { pseudo: "PlayerFour", email: "player4@example.com", password: "hashedpassword4", score_global: 0, role: "user", is_active: true }
        ]);

        // 📌 Add games
        const games = await Game.bulkCreate([
            { id_igdb: 12345, description: "A thrilling adventure game where every decision impacts the world. Explore vast environments and solve challenging puzzles.", genre: "Action", url_video_game: "https://example.com/video1" },
            { id_igdb: 67890, description: "An immersive RPG with an epic storyline, travel through various realms and uncover hidden secrets.", genre: "RPG", url_video_game: "https://example.com/video2" },
            { id_igdb: 11223, description: "A fast-paced competitive game where strategy and quick reflexes are key to victory.", genre: "Shooter", url_video_game: "https://example.com/video3" },
            { id_igdb: 44556, description: "A sports simulation game where players compete in high-stakes matches across various disciplines.", genre: "Sports", url_video_game: "https://example.com/video4" }
        ]);

        // 📌 Add challenges
        const challenges = await Challenge.bulkCreate([
            { game_id: games[0].id, account_id: accounts[0].id, title: "First Challenge", description: "Complete an exciting task in this virtual world. Show your skills and creativity!", rules: "No cheating, be respectful to others.", type: "Solo", video_url: "https://example.com/challenge1" },
            { game_id: games[1].id, account_id: accounts[1].id, title: "Second Challenge", description: "Join a competitive match against others. Win the game to become the champion!", rules: "Respect other players, no toxic behavior.", type: "Competitive", video_url: "https://example.com/challenge2" },
            { game_id: games[2].id, account_id: accounts[2].id, title: "Third Challenge", description: "Dominate the battlefield with your reflexes and sharp mind!", rules: "Fair play, no team killing.", type: "Team", video_url: "https://example.com/challenge3" },
            { game_id: games[3].id, account_id: accounts[3].id, title: "Fourth Challenge", description: "Compete against others in this thrilling sports challenge!", rules: "Follow the rules of the game, no cheating.", type: "Competitive", video_url: "https://example.com/challenge4" }
        ]);

        // 📌 Add participations
        const participations = await Participate.bulkCreate([
            { challenge_id: challenges[0].id, video_url: "https://example.com/video1", image_url: "https://images.pexels.com/photos/856091/pexels-photo-856091.jpeg", score: 10, description: "Successfully completed the challenge! I put in a lot of effort and the experience was unforgettable." , account_id: accounts[0].id},
            { challenge_id: challenges[1].id, video_url: "https://example.com/video2", image_url: "https://images.pexels.com/photos/1339746/pexels-photo-1339746.jpeg", score: 20, description: "An incredible participation! I gave my best and the results show my dedication.", account_id: accounts[1].id },
            { challenge_id: challenges[2].id, video_url: "https://example.com/video3", image_url: "https://images.pexels.com/photos/1339835/pexels-photo-1339835.jpeg", score: 15, description: "Teamwork made this challenge so much fun. We worked together to reach our goal, and it was a great experience!", account_id: accounts[2].id },
            { challenge_id: challenges[3].id, video_url: "https://example.com/video4", image_url: "https://images.pexels.com/photos/1574566/pexels-photo-1574566.jpeg", score: 18, description: "What a challenge! I pushed my limits, and even though I didn't win, I had a fantastic time competing.", account_id: accounts[3].id }
        ]);

        // 📌 Add votes
        await Vote.bulkCreate([
            { account_id: accounts[0].id, participation_id: participations[0].id, vote: 5 },
            { account_id: accounts[1].id, participation_id: participations[1].id, vote: 4 },
            { account_id: accounts[2].id, participation_id: participations[2].id, vote: 3 },
            { account_id: accounts[3].id, participation_id: participations[3].id, vote: 4 }
        ]);

        // 📌 Add comments
        await Comment.bulkCreate([
            { challenge_id: challenges[0].id, account_id: accounts[0].id, text: "Great challenge! I absolutely loved taking part in it. The creativity required was amazing, and I feel like I learned a lot from this experience." },
            { challenge_id: challenges[1].id, account_id: accounts[1].id, text: "I love this concept! The competition was intense, and every round pushed me to my limits. I look forward to participating in more challenges like this." },
            { challenge_id: challenges[2].id, account_id: accounts[2].id, text: "This was such a fun challenge! The team and I really bonded while working together to solve the tasks. It's definitely one of the best experiences I've had." },
            { challenge_id: challenges[3].id, account_id: accounts[3].id, text: "What an amazing sports challenge! I gave it my all, and even though I didn't win, it was an experience I will never forget. The adrenaline was real!" }
        ]);

        // 📌 Add badges
        const badges = await Badge.bulkCreate([
            { name: "Champion", description: "Won 10 solo challenges with outstanding performances." },
            { name: "Explorer", description: "Participated in 5 different challenges, showing a passion for competition and adventure." },
            { name: "Strategist", description: "Achieved top rankings in multiple competitive challenges, demonstrating tactical prowess." },
            { name: "Team Player", description: "Excelled in team challenges, contributing significantly to group success." }
        ]);

        // 📌 Add badge receptions
        await Receive.bulkCreate([
            { account_id: accounts[0].id, badges_id: badges[0].id },
            { account_id: accounts[1].id, badges_id: badges[1].id },
            { account_id: accounts[2].id, badges_id: badges[2].id },
            { account_id: accounts[3].id, badges_id: badges[3].id }
        ]);
        

        console.log("✅ Database populated successfully!");
    } catch (error) {
        console.error("❌ Error during population:", error);
    } finally {
        await sequelize.close();
    }
}

// Run the script
populateDatabase();
