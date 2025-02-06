import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Receive extends Model {}
Receive.init({}, { sequelize, modelName: 'receive' });