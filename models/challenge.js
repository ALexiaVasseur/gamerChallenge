import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";


export class Challenge extends Model {}
Challenge.init({
    id_challenge: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    rules: { type: DataTypes.TEXT, allowNull: false },
    category_challenge: { type: DataTypes.STRING(50), allowNull: false },
    video_url: { type: DataTypes.TEXT, allowNull: true },
    comment: { type: DataTypes.TEXT, allowNull: true }
}, { sequelize, modelName: 'challenge' });