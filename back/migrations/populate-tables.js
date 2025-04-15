import { Game, Account, Challenge, Vote, Comment, Participate, Badge, Receive, sequelize, Category } from "../models/index.js";
import "dotenv/config";


async function populateDatabase() {
    if (process.env.NODE_ENV === 'development') {
        try {
            console.log("🔄 Starting database population...");

            await sequelize.sync({ alter: true });

            // Add categories
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
                },
                { 
                  name: "Adventure", 
                  description: "Les défis d'Aventure demandent exploration et résolution de mystères. Partez à la découverte d'univers fantastiques, trouvez des trésors cachés, et vivez des aventures épiques." 
                },
                { 
                  name: "Strategy", 
                  description: "Les défis Stratégiques mettent à l'épreuve votre esprit tactique. Prenez des décisions cruciales et faites face à des situations complexes pour surmonter vos adversaires." 
                }
            ]);

            // Add accounts
            const accounts = await Account.bulkCreate([
                { pseudo: "ShadowX", email: "player1@example.com", password: "hashedpassword1", score_global: 5, role: "user", is_active: true },
                { pseudo: "CyberWolf", email: "player2@example.com", password: "hashedpassword2", score_global: 10, role: "user", is_active: true },
                { pseudo: "NeonBlade", email: "player3@example.com", password: "hashedpassword3", score_global: 20, role: "user", is_active: true },
                { pseudo: "DarkOverlord", email: "player4@example.com", password: "hashedpassword4", score_global: 25, role: "admin", is_active: true },
                { pseudo: "StormBreaker", email: "player5@example.com", password: "hashedpassword5", score_global: 15, role: "user", is_active: true },
                { pseudo: "VoidSpectre", email: "player6@example.com", password: "hashedpassword6", score_global: 30, role: "user", is_active: true }
            ]);

            // Add games
            const games = await Game.bulkCreate([
                {
                    thumbnail: "https://www.freetogame.com/g/523/thumbnail.jpg",
                    title: "Jeu 1_fallguys",
                    description: "A thrilling adventure game where every decision impacts the world. Explore vast environments and solve challenging puzzles.",
                    genre: "Action",
                    game_url: "https://www.freetogame.com/open/fall-guys"
                },
                {
                    thumbnail: "https://www.freetogame.com/g/508/thumbnail.jpg",
                    title: "Jeu 2_enlisted",
                    description: "An immersive RPG with an epic storyline, travel through various realms and uncover hidden secrets.",
                    genre: "RPG",
                    game_url: "https://www.freetogame.com/open/enlisted"
                },
                {
                    thumbnail: "https://www.freetogame.com/g/582/thumbnail.jpg",
                    title: "Jeu 3_tarisland",
                    description: "A fast-paced competitive game where strategy and quick reflexes are key to victory.",
                    genre: "Shooter",
                    game_url: "https://www.freetogame.com/open/tarisland"
                },
                {
                    thumbnail: "https://www.freetogame.com/g/14/thumbnail.jpg",
                    title: "Jeu 4_Star Trek Online",
                    description: "A free-to-play, 3D, Sci-Fi MMORPG based on the popular Star Trek series.",
                    genre: "MMORPG",
                    game_url: "https://www.freetogame.com/open/star-trek-online"
                },
                {
                    thumbnail: "https://www.freetogame.com/g/472/thumbnail.jpg",
                    title: "Jeu 5_Jade Goddess",
                    description: "Jade Goddess is a free-to-play, browser based MMO inspired by Eastern mythology.",
                    genre: "Puzzle",
                    game_url: "https://www.freetogame.com/open/jade-goddess"
                },
                {
                    thumbnail: "https://www.freetogame.com/g/255/thumbnail.jpg",
                    title: "Jeu 6_Stronghold Kingdoms",
                    description: "A sci-fi space shooter with intense dogfights and exploration.",
                    genre: "Shooter",
                    game_url: "https://www.freetogame.com/open/stronghold-kingdoms"
                },
                {
                    thumbnail: "https://www.freetogame.com/g/350/thumbnail.jpg",
                    title: "Jeu 7_Goodgame Empire",
                    description: "A free to play medieval strategy browser game. Build you own castle and create a powerful army! ",
                    genre: "Adventure",
                    game_url: "https://www.freetogame.com/open/goodgame-empire"
                },
                {
                    thumbnail: "https://www.freetogame.com/g/466/thumbnail.jpg",
                    title: "Jeu 8_Valorant",
                    description: "Test your mettle in Riot Games’ character-based FPS shooter Valorant.",
                    genre: "Strategy",
                    game_url: "https://www.freetogame.com/open/valorant"
                },
                {
                    thumbnail: "https://www.freetogame.com/g/573/thumbnail.jpg",
                    title: "Jeu 9_Titan Revenge",
                    description: "A 3D Norse-themed browser MMORPG developed and published by Game Hollywood Games",
                    genre: "Rhythm",
                    game_url: "https://www.freetogame.com/open/titan-revenge"
                },
                {
                    thumbnail: "https://www.freetogame.com/g/529/thumbnail.jpg",
                    title: "Jeu 10_Tower of Fantasy",
                    description: "Tower of Fantasy is a 3D open-world RPG, anime-style sci-fi MMO RPG game with unique characters and beautiful open vistas!",
                    genre: "Horror",
                    game_url: "https://www.freetogame.com/open/tower-of-fantasy"
                },
                {
                    thumbnail: "https://www.freetogame.com/g/594/thumbnail.jpg",
                    title: "Jeu 11_Stalcraft: X",
                    description: "A free-to-play MMOFPS set in an open-world.",
                    genre: "Open World",
                    game_url: "https://www.freetogame.com/open/stalcraft-x"
                },
                {
                    thumbnail: "https://www.freetogame.com/g/230/thumbnail.jpg",
                    title: "Jeu 12_Ragnarok Online 2",
                    description: "A 3D fantasy MMORPG, and sequel to the popular Ragnarok Online.",
                    genre: "Racing",
                    game_url: "https://www.freetogame.com/open/ragnarok-online-2"
                }
            ]
            );


            // Add challenges
            const challenges = await Challenge.bulkCreate([
                { game_id: games[0].id, account_id: accounts[0].id, title: "Kingdom Come", description: "Plongez dans un RPG médiéval réaliste où chaque choix influence votre destin. Menez des combats intenses, maîtrisez l'artisanat et explorez un monde ouvert historiquement fidèle.", rules: "Utilisez uniquement les mécaniques du jeu, pas de mods de triche. Respectez les autres joueurs en mode multijoueur et suivez les objectifs du défi.", type: "Solo", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/379430/header.jpg", category_id: categories[0].id },
                { game_id: games[1].id, account_id: accounts[1].id, title: "Conquest of Westeros", description: "Join a competitive match against others. Win the game to become the champion!", rules: "Respect other players, no toxic behavior.", type: "Competitive", image_url: "https://www.jeuxnavigateur.com/images/thumbnails/game-of-thrones-winter-is-coming.jpg", category_id: categories[1].id },
                { game_id: games[2].id, account_id: accounts[2].id, title: "Tactical Warfare", description: "Dominate the battlefield with your reflexes and sharp mind!", rules: "Fair play, no team killing.", type: "Team", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/582660/header.jpg", category_id: categories[2].id },
                { game_id: games[3].id, account_id: accounts[3].id, title: "Ultimate Showdown", description: "Compete against others in this thrilling sports challenge!", rules: "Follow the rules of the game, no cheating.", type: "Competitive", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/678960/header.jpg", category_id: categories[1].id },
                { game_id: games[4].id, account_id: accounts[4].id, title: "Mind Hack", description: "Solve mind-bending puzzles in a world of mystery and intrigue.", rules: "Think outside the box, no cheating.", type: "Solo", image_url: "https://bigmedia.bpifrance.fr/sites/default/files/styles/bigmedia_article/public/2022-03/mario.jpg?itok=h5P6EMjR", category_id: categories[3].id },
                { game_id: games[5].id, account_id: accounts[5].id, title: "Galactic Conquest", description: "Engage in intense space battles and come out on top!", rules: "Play fair, no exploits.", type: "Competitive", image_url: "https://www.journaldugeek.com/app/uploads/2023/03/mariobros.jpg", category_id: categories[4].id },
                { game_id: games[0].id, account_id: accounts[0].id, title: "Choice of Destiny", description: "Make impactful decisions in this adventure and see how they shape the world!", rules: "No spoilers, enjoy the journey.", type: "Solo", image_url: "https://img.lemde.fr/2019/08/20/0/0/920/518/700/0/75/0/d7e78e6_woe19_sh8WPFx8vvPbljt8-O.png", category_id: categories[0].id },
                { game_id: games[1].id, account_id: accounts[1].id, title: "Strategic Domination", description: "Form alliances and outsmart your opponents to claim victory!", rules: "Work together, but beware of betrayals.", type: "Team", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg", category_id: categories[1].id },
                { game_id: games[2].id, account_id: accounts[2].id, title: "Beat Battle", description: "Compete in rhythm challenges and show off your musical skills!", rules: "Stay in the rhythm, no pausing!", type: "Competitive", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/620980/header.jpg", category_id: categories[2].id },
                { game_id: games[3].id, account_id: accounts[3].id, title: "Survive the Night", description: "Escape from terrifying creatures and survive until dawn!", rules: "Keep quiet, no flashlight use.", type: "Solo", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/418370/header.jpg", category_id: categories[3].id },
                { game_id: games[4].id, account_id: accounts[4].id, title: "Treasure Hunter", description: "Explore the world to find hidden treasures and complete quests!", rules: "Respect the environment, no cheating.", type: "Solo", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg", category_id: categories[4].id },
                { game_id: games[5].id, account_id: accounts[5].id, title: "Speed Racer", description: "Race against others and claim the title of the fastest racer!", rules: "No shortcuts, play fair.", type: "Competitive", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg", category_id: categories[1].id }
            ]);

            // Add participations
            const participations = await Participate.bulkCreate([
                { challenge_id: challenges[0].id, video_url: "https://www.youtube.com/watch?v=mSSEWE1vCSg", score: 10, description: "Successfully completed the challenge!", account_id: accounts[0].id },
                { challenge_id: challenges[1].id, video_url: "https://www.youtube.com/watch?v=6nKREX6YeCY", score: 20, description: "An incredible participation!", account_id: accounts[1].id },
                { challenge_id: challenges[2].id, video_url: "https://www.youtube.com/watch?v=e3tKswNLFjc", score: 15, description: "Teamwork made this challenge fun!", account_id: accounts[2].id },
                { challenge_id: challenges[3].id, video_url: "https://www.youtube.com/watch?v=e3tKswNLFjc", score: 18, description: "What a challenge!", account_id: accounts[3].id },
                { challenge_id: challenges[4].id, video_url: "https://www.youtube.com/watch?v=e3tKswNLFjc", score: 17, description: "Puzzle solved!", account_id: accounts[4].id },
                { challenge_id: challenges[5].id, video_url: "https://www.youtube.com/watch?v=e3tKswNLFjc", score: 22, description: "Victory in space!", account_id: accounts[5].id }
            ]);

            // Add votes
            await Vote.bulkCreate([
                { account_id: accounts[0].id, participation_id: participations[1].id, vote: 5 },
                { account_id: accounts[1].id, participation_id: participations[2].id, vote: 4 },
                { account_id: accounts[2].id, participation_id: participations[3].id, vote: 3 },
                { account_id: accounts[3].id, participation_id: participations[0].id, vote: 4 },
                { account_id: accounts[4].id, participation_id: participations[4].id, vote: 5 },
                { account_id: accounts[5].id, participation_id: participations[5].id, vote: 5 }
            ]);

            // Add comments
            await Comment.bulkCreate([
                { challenge_id: challenges[0].id, account_id: accounts[0].id, text: "Great challenge!" },
                { challenge_id: challenges[1].id, account_id: accounts[1].id, text: "I love this concept!" },
                { challenge_id: challenges[2].id, account_id: accounts[2].id, text: "This was such a fun challenge!" },
                { challenge_id: challenges[3].id, account_id: accounts[3].id, text: "What an amazing sports challenge!" },
                { challenge_id: challenges[4].id, account_id: accounts[4].id, text: "Mind-blowing puzzles!" },
                { challenge_id: challenges[5].id, account_id: accounts[5].id, text: "Space battles are intense!" }
            ]);

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
