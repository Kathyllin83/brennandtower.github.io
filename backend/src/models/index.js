const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Warehouse = require('./Warehouse');
const Item = require('./Item');
const Order = require('./Order');

const connection = new Sequelize(dbConfig);

// Initialize models
Warehouse.init(connection);
Item.init(connection);
Order.init(connection);

// Initialize associations
Warehouse.associate(connection.models);
Item.associate(connection.models);
Order.associate(connection.models);

module.exports = connection;
