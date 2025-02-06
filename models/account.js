import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";



export class Account extends Model {}
Account.init({
    id_account: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    pseudo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'user' }
}, { sequelize, modelName: 'account' });