import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Category extends Model {}

Category.init({
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true, // Assure que chaque catégorie a un nom unique
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'category',
  tableName: 'categories',
  timestamps: true, // Ajoute createdAt et updatedAt
  underscored: true, // Pour le format snake_case
});
