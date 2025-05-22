"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Transactions", "userId");
    await queryInterface.addColumn("Transactions", "senderId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn("Transactions", "recipientId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Transactions", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.removeColumn("Transactions", "senderId");
    await queryInterface.removeColumn("Transactions", "recipientId");
  },
};
