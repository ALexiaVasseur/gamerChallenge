import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";


export class Game extends Model {}
Game.init({
    id_game: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_igdb: { type: DataTypes.INTEGER, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    category_game: { type: DataTypes.STRING(50), allowNull: false },
    genre: { type: DataTypes.STRING(50), allowNull: false }
}, { sequelize, modelName: 'game' });