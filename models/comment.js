import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";


export class Comment extends Model {}
Comment.init({
    text: { type: DataTypes.TEXT, allowNull: false }
}, { sequelize, modelName: 'comment' });