import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import Client from "./Client";

class Payment extends Model {
  public id!: number;
  public clientId!: number;
  public amount!: number;
  public status!: string;
  public sessionId!: string;
  public token!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "PENDING",
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "Payments",
    timestamps: true,
  }
);

Payment.belongsTo(Client, { foreignKey: "clientId", as: "client" });
Client.hasMany(Payment, { foreignKey: "clientId", as: "payments" });

export default Payment;
