'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Warehouses', [
      {
        name: 'Central',
        location: 'Sede',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Recife',
        location: 'Recife',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Curitiba',
        location: 'Curitiba',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Warehouses', null, {});
  }
};