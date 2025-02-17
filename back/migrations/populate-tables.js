import { Game, Account, Challenge, Vote, Comment, Participate, Badge, Receive, sequelize, Category } from "../models/index.js";
import "dotenv/config";


async function populateDatabase() {
    if (process.env.NODE_ENV === 'development') {
        try {
            console.log("🔄 Starting database population...");

            // Synchroniser les modèles et forcer la réinitialisation des tables
            await sequelize.sync({ alter: true });

            // Ajouter des catégories (si elles n'existent pas déjà)
            const categories = await Category.bulkCreate([
                { 
                  name: "Solo", 
                  description: "Les défis Solo mettent à l'épreuve vos compétences individuelles. Ces challenges vous invitent à explorer, créer et repousser vos limites en résolvant des énigmes complexes ou en réalisant des exploits personnels. C'est l'occasion de montrer votre créativité, votre persévérance et votre capacité à réussir en solo." 
                },
                { 
                  name: "Competitive", 
                  description: "Les défis Compétitifs sont conçus pour tester votre esprit de compétition et votre stratégie. Engagez-vous dans des affrontements intenses contre d'autres joueurs, mesurez votre talent et grimpez dans les classements. Ces challenges exigent rapidité, précision et une excellente gestion du stress pour atteindre la victoire." 
                },
                { 
                  name: "Team", 
                  description: "Les défis d'Équipe reposent sur la collaboration et l'esprit d'équipe. Dans ces challenges, vous devez travailler main dans la main avec d'autres joueurs pour surmonter des obstacles, élaborer des stratégies communes et atteindre des objectifs collectifs. Ils renforcent la communication, la coordination et la solidarité au sein du groupe." 
                }
              ]);
              

            // Ajouter les comptes
            const accounts = await Account.bulkCreate([
                { pseudo: "PlayerOne", email: "player1@example.com", password: "hashedpassword1", score_global: 5, role: "user", is_active: true },
                { pseudo: "PlayerTwo", email: "player2@example.com", password: "hashedpassword2", score_global: 10, role: "user", is_active: true },
                { pseudo: "PlayerThree", email: "player3@example.com", password: "hashedpassword3", score_global: 20, role: "user", is_active: true },
                { pseudo: "PlayerFour", email: "player4@example.com", password: "hashedpassword4", score_global: 25, role: "user", is_active: true }
            ]);

            // Ajouter des jeux
            const games = await Game.bulkCreate([
                { id_igdb: 12345, title: "Jeu 1", description: "A thrilling adventure game where every decision impacts the world. Explore vast environments and solve challenging puzzles.", genre: "Action", url_video_game: "https://www.youtube.com/watch?v=rBg69tpjAzQ&pp=ygUXc21hbGwgdmlkZW8gb2YgZ2FtZXBsYXk%3D" },
                { id_igdb: 67890, title: "Jeu 2", description: "An immersive RPG with an epic storyline, travel through various realms and uncover hidden secrets.", genre: "RPG", url_video_game: "https://www.youtube.com/watch?v=rBg69tpjAzQ&pp=ygUXc21hbGwgdmlkZW8gb2YgZ2FtZXBsYXk%3D" },
                { id_igdb: 11223, title: "Jeu 3", description: "A fast-paced competitive game where strategy and quick reflexes are key to victory.", genre: "Shooter", url_video_game: "https://www.youtube.com/watch?v=rBg69tpjAzQ&pp=ygUXc21hbGwgdmlkZW8gb2YgZ2FtZXBsYXk%3D" },
                { id_igdb: 44556, title: "Jeu 4", description: "A sports simulation game where players compete in high-stakes matches across various disciplines.", genre: "Sports", url_video_game: "https://preview.redd.it/563u5bozpcb91.jpg?width=640&crop=smart&auto=webp&s=cea192d42b6cddbeffcd5870dd89b30a2be6ab1c" }
            ]);

            // Ajouter des défis avec un `category_id` valide
            const challenges = await Challenge.bulkCreate([
                { game_id: games[0].id, account_id: accounts[0].id, title: "First Challenge", description: "Complete an exciting task in this virtual world. Show your skills and creativity!", rules: "No cheating, be respectful to others.", type: "Solo", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/379430/header.jpg", category_id: categories[0].id },
                { game_id: games[1].id, account_id: accounts[1].id, title: "Second Challenge", description: "Join a competitive match against others. Win the game to become the champion!", rules: "Respect other players, no toxic behavior.", type: "Competitive", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg", category_id: categories[1].id },
                { game_id: games[2].id, account_id: accounts[2].id, title: "Third Challenge", description: "Dominate the battlefield with your reflexes and sharp mind!", rules: "Fair play, no team killing.", type: "Team", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/582660/header.jpg", category_id: categories[2].id },
                { game_id: games[3].id, account_id: accounts[3].id, title: "Fourth Challenge", description: "Compete against others in this thrilling sports challenge!", rules: "Follow the rules of the game, no cheating.", type: "Competitive", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/678960/header.jpg", category_id: categories[1].id }
            ]);

            // Ajouter les participations
            const participations = await Participate.bulkCreate([
                { challenge_id: challenges[0].id, video_url: "https://www.youtube.com/watch?v=e3tKswNLFjc", image_url: "https://images.pexels.com/photos/856091/pexels-photo-856091.jpeg", score: 10, description: "Successfully completed the challenge!", account_id: accounts[0].id },
                { challenge_id: challenges[1].id, video_url: "https://www.youtube.com/watch?v=e3tKswNLFjc", image_url: "https://images.pexels.com/photos/1339746/pexels-photo-1339746.jpeg", score: 20, description: "An incredible participation!", account_id: accounts[1].id },
                { challenge_id: challenges[2].id, video_url: "https://www.youtube.com/watch?v=e3tKswNLFjc", image_url: "https://images.pexels.com/photos/1339835/pexels-photo-1339835.jpeg", score: 15, description: "Teamwork made this challenge fun!", account_id: accounts[2].id },
                { challenge_id: challenges[3].id, video_url: "https://www.youtube.com/watch?v=e3tKswNLFjc", image_url: "https://images.pexels.com/photos/1574566/pexels-photo-1574566.jpeg", score: 18, description: "What a challenge!", account_id: accounts[3].id }
            ]);

            // Ajouter des votes
            await Vote.bulkCreate([
                { account_id: accounts[0].id, participation_id: participations[0].id, vote: 5 },
                { account_id: accounts[1].id, participation_id: participations[1].id, vote: 4 },
                { account_id: accounts[2].id, participation_id: participations[2].id, vote: 3 },
                { account_id: accounts[3].id, participation_id: participations[3].id, vote: 4 }
            ]);

            // Ajouter des commentaires
            await Comment.bulkCreate([
                { challenge_id: challenges[0].id, account_id: accounts[0].id, text: "Great challenge!" },
                { challenge_id: challenges[1].id, account_id: accounts[1].id, text: "I love this concept!" },
                { challenge_id: challenges[2].id, account_id: accounts[2].id, text: "This was such a fun challenge!" },
                { challenge_id: challenges[3].id, account_id: accounts[3].id, text: "What an amazing sports challenge!" }
            ]);
            
            // const badges = await Badge.bulkCreate([
            //     { name: "Champion", description: "Won 10 solo challenges with outstanding performances.", imageUrl: "public/pictures/badge_1.webp" },
            //     { name: "Explorer", description: "Participated in 5 different challenges, showing a passion for competition and adventure.", imageUrl: "public/pictures/badge_2.webp" },
            //     { name: "Strategist", description: "Achieved top rankings in multiple competitive challenges, demonstrating tactical prowess.", imageUrl: "public/pictures/badge_3.webp" },
            //     { name: "Team Player", description: "Excelled in team challenges, contributing significantly to group success.", imageUrl: "public/pictures/badge_4.webp" }
            // ]);
            
            // await Receive.bulkCreate([
            //     { account_id: accounts[0].id, badges_id: badges[0].id },
            //     { account_id: accounts[1].id, badges_id: badges[1].id },
            //     { account_id: accounts[2].id, badges_id: badges[2].id },
            //     { account_id: accounts[3].id, badges_id: badges[3].id }
            // ]);

            console.log("✅ Database populated successfully!");
        } catch (error) {
            console.error("❌ Error during population:", error);
        } finally {
            await sequelize.close();
        }
    } else {
        console.log("⚠️ Environnement non développement. Aucune donnée peuplée.");
    }
}

// Run the script
populateDatabase();
