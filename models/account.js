import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Account extends Model {}

Account.init({
  id: {  // Renommé de id_account à id
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  pseudo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  score_global: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'user'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'account',
  tableName: 'accounts', // Optionnel si tu veux spécifier le nom de la table
  timestamps: true, // Ajoute createdAt et updatedAt
  underscored: true // Si tu préfères le format snake_case pour les noms de colonnes
});
