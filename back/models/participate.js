import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-client.js';

export class Participate extends Model {}

Participate.init({
  challenge_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'challenges', // Nom de la table du modèle Challenge
      key: 'id'
    },
    onDelete: 'CASCADE' // Suppression en cascade si Challenge est supprimé
  },
  video_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'participation',
  tableName: 'participations', // Nom de la table dans la base de données
  timestamps: true, // Ajoute createdAt et updatedAt
  underscored: true // Si tu préfères le format snake_case pour les noms de colonnes
});