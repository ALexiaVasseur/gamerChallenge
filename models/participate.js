import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";


export class Participate extends Model {}
Participate.init({}, { sequelize, modelName: 'participate' });