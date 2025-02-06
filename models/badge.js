import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Badge extends Model {}
Badge.init({
    id_badge: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true }
}, { sequelize, modelName: 'badge' });