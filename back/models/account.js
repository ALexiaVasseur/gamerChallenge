import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Account extends Model {}

Account.init({
  pseudo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: "Le pseudo ne peut pas être vide"
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  score_global: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'user'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  refresh_token: { 
    type: DataTypes.STRING(255),
    allowNull: true
  },
  description: { 
    type: DataTypes.TEXT,
    allowNull: true
  }

}, {
  sequelize,
  modelName: 'account',
  tableName: 'accounts',
  timestamps: true,
  underscored: true
});