const path = require('path');

module.exports = {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '..', 'database.sqlite'),
  logging: console.log, // Set to false to disable logging
};