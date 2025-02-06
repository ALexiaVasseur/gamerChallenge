import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-client.js';

export class Challenge extends Model {}

Challenge.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_game: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'games', // Nom de la table du modèle Game
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rules: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  video_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  id_account: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'accounts', // Nom de la table du modèle Account
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'challenge',
  tableName: 'challenges', // Nom de la table dans la base de données
  timestamps: true, // Ajoute createdAt et updatedAt
  underscored: true // Si tu préfères le format snake_case pour les noms de colonnes
});
