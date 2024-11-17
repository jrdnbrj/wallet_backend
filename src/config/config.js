// This file is required by Sequelize CLI, which only supports JavaScript configuration files.
// Although the project uses TypeScript, this file ensures compatibility with Sequelize CLI.

require("dotenv").config();

module.exports = {
  development: {
    use_env_variable: "EXTERNAL_DB_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
