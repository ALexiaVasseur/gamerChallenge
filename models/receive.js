import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-client.js';

export class Receive extends Model {}

Receive.init({
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
  id_badge: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'badges', // Nom de la table du modèle Badge
      key: 'id'
    },
    primaryKey: true,
    onDelete: 'CASCADE' // Suppression en cascade si Badge est supprimé
  }
}, {
  sequelize,
  modelName: 'receive',
  tableName: 'receives', // Nom de la table dans la base de données
  timestamps: true, // Ajoute createdAt et updatedAt
  underscored: true // Si tu préfères le format snake_case pour les noms de colonnes
});
