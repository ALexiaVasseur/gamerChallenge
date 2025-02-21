import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-client.js';

export class Game extends Model {}

Game.init({
  id_igdb: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,  // Le titre ne peut pas être nul
    unique: true,      // Le titre doit être unique
    validate: {
      notEmpty: {
        msg: 'Le titre ne peut pas être vide' // Validation pour empêcher un titre vide
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  genre: {
    type: DataTypes.STRING(50),
    allowNull: false,  // Genre obligatoire
    validate: {
      notEmpty: {
        msg: 'Le genre ne peut pas être vide', // Validation pour éviter une chaîne vide
      }
    }
  },
  url_video_game: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'game',
  tableName: 'games', // Nom de la table dans la base de données
  timestamps: true, // Ajoute createdAt et updatedAt
  underscored: true // Si tu préfères le format snake_case pour les noms de colonnes
});