import { Challenge, Game, Account, sequelize, Category } from "../models/index.js";

// Vérifie que la variable PG_URL est bien définie avant d'initialiser Sequelize
beforeAll(async () => {
  console.log("PG_URL:", process.env.PG_URL); // Affiche la valeur de PG_URL

  try {
    await sequelize.authenticate();  // Vérifie la connexion à la DB
    await sequelize.sync({ force: true });  // Réinitialise la DB
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

afterAll(async () => {
  await sequelize.close();
});

describe("Challenge Model", () => {
  let game, account, category;

  beforeAll(async () => {
    // Créer un jeu avec un genre valide
    game = await Game.create({
      title: 'Test Game',
      description: 'A game for testing purposes',
      genre: 'Action',  // Genre valide ajouté ici
    });

    // Créer un utilisateur (account) valide
    account = await Account.create({
      pseudo: 'TestUser',
      email: 'testuser@example.com',
      password: 'password123',
    });

    // Créer une catégorie valide
    category = await Category.create({
      name: 'Action',
      description: 'Action games',
    });
  });

  it('should create a challenge associated with a game and account', async () => {
    // Créer un challenge avec des valeurs valides
    const challenge = await Challenge.create({
      title: 'Test Challenge',
      description: 'A challenge to test the functionality',
      game_id: game.id,  // Utiliser l'ID du jeu créé
      account_id: account.id,  // Utiliser l'ID de l'utilisateur créé
      category_id: category.id,  // Utiliser l'ID de la catégorie
      rules: 'Complete the game within a week',  // Valeur pour "rules"
      type: 'Timed',  // Valeur pour "type"
    });
  
    // Vérifications de la création du challenge
    expect(challenge).toHaveProperty('id');
    expect(challenge.game_id).toBe(game.id);
    expect(challenge.account_id).toBe(account.id);
    expect(challenge.category_id).toBe(category.id);
    expect(challenge.rules).toBe('Complete the game within a week');
    expect(challenge.type).toBe('Timed');
  });
});
