import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-client.js';

export class Vote extends Model {}

Vote.init({
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'accounts', // Nom de la table du modèle Account
      key: 'id'
    },
    primaryKey: true,
    onDelete: 'CASCADE' // Suppression en cascade si Account est supprimé
  },
  participation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'participations', // Nom de la table du modèle Participation
      key: 'id'
    },
    primaryKey: true,
    onDelete: 'CASCADE' // Suppression en cascade si Participation est supprimée
  },
  vote: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  }
}, {
  sequelize,
  modelName: 'vote',
  tableName: 'votes', // Nom de la table dans la base de données
  timestamps: true, // Ajoute createdAt et updatedAt
  underscored: true // Si tu préfères le format snake_case pour les noms de colonnes
});