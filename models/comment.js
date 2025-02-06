import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-client.js';

export class Comment extends Model {}

Comment.init({
  id_challenge: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'challenges', // Nom de la table du modèle Challenge
      key: 'id'
    },
    primaryKey: true,
    onDelete: 'CASCADE' // Suppression en cascade si Challenge est supprimé
  },
  id_account: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'accounts', // Nom de la table du modèle Account
      key: 'id'
    },
    primaryKey: true,
    onDelete: 'CASCADE' // Suppression en cascade si Account est supprimé
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'comment',
  tableName: 'comments', // Nom de la table dans la base de données
  timestamps: true, // Ajoute createdAt et updatedAt
  underscored: true // Si tu préfères le format snake_case pour les noms de colonnes
});
