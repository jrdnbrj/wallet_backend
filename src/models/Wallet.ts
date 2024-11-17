import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import Client from "./Client";

class Wallet extends Model {
  public id!: number;
  public balance!: number;
  public clientId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Wallet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "Wallets",
    timestamps: true,
  }
);

Client.hasOne(Wallet, {
  foreignKey: "clientId",
  as: "wallet",
});
Wallet.belongsTo(Client, {
  foreignKey: "clientId",
  as: "client",
});

export default Wallet;
