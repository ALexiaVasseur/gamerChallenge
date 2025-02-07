import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-client.js';

export class Game extends Model {}

Game.init({
  id_igdb: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  genre: {
    type: DataTypes.STRING(50),
    allowNull: false
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