import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-client.js';

export class Vote extends Model {}

Vote.init({
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
  participation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'participations', 
      key: 'id'
    },
    primaryKey: true,
    onDelete: 'CASCADE'
  },
  vote: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  }
}, {
  sequelize,
  modelName: 'vote',
  tableName: 'votes', 
  timestamps: true,
  underscored: true 
});