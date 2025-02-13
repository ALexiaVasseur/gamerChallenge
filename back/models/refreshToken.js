import { DataTypes } from "sequelize";
import { sequelize } from "./sequelize-client.js";

export const RefreshToken = sequelize.define("RefreshToken", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "accounts",
      key: "id",
    },
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default RefreshToken;
