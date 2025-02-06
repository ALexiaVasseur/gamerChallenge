import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";


export class Vote extends Model {}
Vote.init({
    note: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } }
}, { sequelize, modelName: 'vote' });