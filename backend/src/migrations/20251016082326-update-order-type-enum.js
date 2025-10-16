'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Orders', 'type', {
      type: Sequelize.ENUM('Requisição', 'Reparo', 'Abastecimento'),
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Orders', 'type', {
      type: Sequelize.ENUM('Requisição', 'Reparo'),
      allowNull: false,
    });
  }
};