import { Account, sequelize } from "../models/index.js";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("🔍 Account Model", () => {
  it("✅ Devrait créer un nouveau compte", async () => {
    const account = await Account.create({
      pseudo: "TestUser",
      email: "testuser@example.com",
      password: "securepassword",
    });


    expect(account.id).toBeDefined();
    expect(account.pseudo).toBe("TestUser");
    expect(account.email).toBe("testuser@example.com");
    expect(account.score_global).toBe(0); 
    expect(account.is_active).toBe(true); 
  });

  it("❌ Ne devrait pas autoriser des emails en double", async () => {
    const email = "user@example.com";
    await Account.create({
      pseudo: "User1",
      email: email,
      password: "password123"
    });
    await expect(
      Account.create({
        pseudo: "User2",
        email: email,
        password: "anotherpassword"
      })
    ).rejects.toThrowError("la valeur d'une clé dupliquée rompt la contrainte unique « accounts_email_key »");
  });

  it("❌ Ne devrait pas permettre un pseudo vide", async () => {
    await expect(
      Account.create({
        pseudo: "",
        email: "invaliduser@example.com",
        password: "securepassword"
      })
    ).rejects.toThrow("Le pseudo ne peut pas être vide");
  });
  
});
