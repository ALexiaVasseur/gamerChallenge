import { sequelize } from '../models/index.js';
import "dotenv/config";

async function resetDatabase() {
  try {
    console.log("🛠 Suppression complète de la base de données...");

    const syncOptions = process.env.NODE_ENV === "development" ? { force : true } : { alter: true};

    console.log(process.env.NODE_ENV === 'development' ? "⚠️ Mode Développement - Tables seront supprimées et recréées." : "🔄 Mode Production - Tables seront mises à jour.");

    console.log("📌 Base de données nettoyée, recréation des tables...");

    await sequelize.sync(syncOptions);

    console.log("✅ Base de données recréée avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de la suppression/recréation des tables:", error);
  } finally {
    await sequelize.close();
  }
}

resetDatabase();
