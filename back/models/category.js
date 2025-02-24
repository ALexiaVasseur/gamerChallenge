import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Category extends Model {}

Category.init({
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'category',
  tableName: 'categories',
  timestamps: true, 
  underscored: true,
});
