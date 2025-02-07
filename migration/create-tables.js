/* import { sequelize } from '../models/index.js';


async function resetDatabase() {
  try {
    console.log("📌 Suppression des tables...");
    
    // Désactiver les contraintes de clé étrangère temporairement
    await sequelize.query('SET CONSTRAINTS ALL DEFERRED;');

    // Supprimer les tables dépendantes en premier
    await sequelize.query('DROP TABLE IF EXISTS "participate" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "vote" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "comment" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "receive" CASCADE;');

    // Maintenant, supprimer les tables principales
    await sequelize.query('DROP TABLE IF EXISTS "challenges" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "game" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "account" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "badge" CASCADE;');

    console.log("📌 Tables supprimées avec succès.");

    // Recréer la base de données
    await sequelize.sync({ force: true });
    console.log("✅ Base de données recréée avec succès.");
  } catch (error) {
    console.error("❌ Erreur lors de la suppression/recréation des tables:", error);
  } finally {
    await sequelize.close();
  }
}

resetDatabase(); */

import { sequelize } from '../models/index.js';

async function resetDatabase() {
    try {
      console.log("🛠 Suppression complète de la base de données...");
  
      // 🚨 Supprime tout le schéma pour éviter les dépendances bloquantes
      await sequelize.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
  
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