'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Orders', 'status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Orders', 'status', {
      type: Sequelize.ENUM('Aberto', 'Em Andamento', 'Entregue', 'Encerrado'),
      allowNull: true,
    });
  }
};