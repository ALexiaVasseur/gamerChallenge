import { Game } from "../models/index.js";
import { sequelize } from "../models/sequelize-client.js";

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Réinitialise la DB avant tous les tests
});

afterAll(async () => {
  await sequelize.close(); // Ferme la connexion à la base de données après les tests
});

describe("🎮 Game Model", () => {

  it("✅ Devrait créer un nouveau jeu", async () => {
    const game = await Game.create({
      title: "New Game",
      description: "A great game",
      genre: "Action",
      url_video_game: "https://example.com/game"
    });

    expect(game.id).toBeDefined();
    expect(game.title).toBe("New Game");
    expect(game.genre).toBe("Action");
  });

  it("❌ Ne devrait pas permettre un genre vide", async () => {
    await expect(
      Game.create({
        title: "Invalid Game",
        description: "This game has no genre",
        genre: "",  // Genre vide
        url_video_game: "https://example.com/game"
      })
    ).rejects.toThrowError("Le genre ne peut pas être vide");
  });

  it("❌ Ne devrait pas autoriser des titres de jeux en double", async () => {
    const title = "Duplicate Game";
    await Game.create({
      title: title,
      description: "First game with this title",
      genre: "Action",
      url_video_game: "https://example.com/game"
    });
  
    await expect(
      Game.create({
        title: title,  // Titre dupliqué
        description: "Second game with this title",
        genre: "Adventure",
        url_video_game: "https://example.com/second-game"
      })
    ).rejects.toThrowError("la valeur d'une clé dupliquée rompt la contrainte unique « games_title_key »");
  });
  

  it("❌ Ne devrait pas permettre un titre vide", async () => {
    await expect(
      Game.create({
        title: "",  // Titre vide
        description: "A game without a title",
        genre: "Action",
        url_video_game: "https://example.com/invalid-game"
      })
    ).rejects.toThrowError("Validation error: Le titre ne peut pas être vide");
  });
  

  it("✅ Devrait permettre un jeu sans URL vidéo (champ optionnel)", async () => {
    const game = await Game.create({
      title: "Game Without URL",
      description: "This game has no URL",
      genre: "Puzzle"
    });

    expect(game.url_video_game).toBeNull(); // URL vidéo est optionnelle
  });

});
