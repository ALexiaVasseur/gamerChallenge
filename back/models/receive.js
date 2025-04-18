import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Receive extends Model {}

Receive.init({
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accounts', 
            key: 'id'
        }
    },
    badge_id: {
        type: DataTypes.INTEGER,
        allowNull: true, 
        references: {
            model: 'badges',
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, { 
    sequelize, 
    modelName: 'receive',
    tableName: 'receives',
    timestamps: true, 
    underscored: true
});