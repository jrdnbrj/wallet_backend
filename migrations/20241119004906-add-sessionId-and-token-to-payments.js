"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Payments", "sessionId", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Payments", "token", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Payments", "sessionId");
    await queryInterface.removeColumn("Payments", "token");
  },
};
