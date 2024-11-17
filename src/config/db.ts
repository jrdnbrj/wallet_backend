import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: `.env` });

const sequelize = new Sequelize(process.env.EXTERNAL_DB_URL || "", {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;
