import { DataTypes, Model } from 'sequelize';
import { sequelize } from './sequelize-client.js';

export class Challenge extends Model {}

Challenge.init({
  game_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'games',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rules: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: "default",
  },
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'accounts',
      key: 'id'
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'challenge',
  tableName: 'challenges',
  timestamps: true,
  underscored: true
});
