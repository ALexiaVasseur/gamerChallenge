import { Challenge, Game, Account, sequelize, Category } from "../models/index.js";

beforeAll(async () => {
  try {
    await sequelize.authenticate();  
    await sequelize.sync({ force: true }); 
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
    game = await Game.create({
      title: 'Test Game',
      description: 'A game for testing purposes',
      genre: 'Action', 
    });

    account = await Account.create({
      pseudo: 'TestUser',
      email: 'testuser@example.com',
      password: 'password123',
    });

    category = await Category.create({
      name: 'Action',
      description: 'Action games',
    });
  });

  it('should create a challenge associated with a game and account', async () => {
    const challenge = await Challenge.create({
      title: 'Test Challenge',
      description: 'A challenge to test the functionality',
      game_id: game.id, 
      account_id: account.id,
      category_id: category.id, 
      rules: 'Complete the game within a week', 
      type: 'Timed', 
    });
  
    expect(challenge).toHaveProperty('id');
    expect(challenge.game_id).toBe(game.id);
    expect(challenge.account_id).toBe(account.id);
    expect(challenge.category_id).toBe(category.id);
    expect(challenge.rules).toBe('Complete the game within a week');
    expect(challenge.type).toBe('Timed');
  });
});
