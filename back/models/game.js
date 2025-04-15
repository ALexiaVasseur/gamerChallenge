import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-client.js';

export class Game extends Model {}

Game.init({
  thumbnail: {
    type: DataTypes.STRING(255), // Changement en STRING pour stocker l'URL de l'image
    allowNull: false, // Rend obligatoire la présence d'une image
    validate: {
      isUrl: {
        msg: 'thumbnail doit être une URL valide' 
      }
    }
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
  game_url: {
    type: DataTypes.STRING(255),
    allowNull: false, // Rend obligatoire la présence d'un lien de jeu
    validate: {
      isUrl: {
        msg: 'L’URL du jeu doit être valide'
      }
    }
  }
}, {
  sequelize,
  modelName: 'game',
  tableName: 'games',
  timestamps: true,
  underscored: true
});
