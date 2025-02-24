import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-client.js';

export class Comment extends Model {}

Comment.init({
  challenge_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'challenges',
      key: 'id'
    },
    primaryKey: true,
    onDelete: 'CASCADE' 
  },
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'accounts',
      key: 'id'
    },
    primaryKey: true,
    onDelete: 'CASCADE' 
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'comment',
  tableName: 'comments',
  timestamps: true,
  underscored: true
});