
import { sequelize } from '../models/index.js';

async function resetDatabase() {
    try {
      console.log("🛠 Suppression complète de la base de données...");
  
      // 🚨 Supprime tout le schéma pour éviter les dépendances bloquantes
      // Suppression des tables
      await sequelize.drop();
      // await sequelize.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
  
      console.log("📌 Base de données nettoyée, recréation des tables...");
  
      // 🔄 Resynchronisation des modèles
      await sequelize.sync();
  
      console.log("✅ Base de données recréée avec succès !");
    } catch (error) {
      console.error("❌ Erreur lors de la suppression/recréation des tables:", error);
    } finally {
      await sequelize.close();
    }
  }
  
  resetDatabase();  