import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-client.js';

export class Participate extends Model {}

Participate.init({
  challenge_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'challenges',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  video_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'participation',
  tableName: 'participations',
  timestamps: true, 
  underscored: true 
});