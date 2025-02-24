import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-client.js';

export class Game extends Model {}

Game.init({
  id_igdb: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false, 
    unique: true,  
    validate: {
      notEmpty: {
        msg: 'Le titre ne peut pas être vide' 
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  genre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Le genre ne peut pas être vide', 
      }
    }
  },
  url_video_game: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'game',
  tableName: 'games',
  timestamps: true,
  underscored: true
});