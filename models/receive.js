import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export class Receive extends Model {}

Receive.init({
    id_account: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'accounts', // Référence la table accounts
            key: 'id_account'
        }
    },
    id_badge: {
        type: DataTypes.INTEGER,
        allowNull: true, // Permet des valeurs NULL pour id_badge
        references: {
            model: 'badges', // Référence la table badges
            key: 'id_badge'
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
    timestamps: true, // Si tu gères manuellement les champs created_at et updated_at
    underscored: true
});
