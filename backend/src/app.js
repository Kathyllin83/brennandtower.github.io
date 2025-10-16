require('dotenv').config();
const express = require('express');
const cors = require('cors');
const itemRoutes = require('./routes/items');
const orderRoutes = require('./routes/orders');
const dashboardRoutes = require('./routes/dashboard');
const warehouseRoutes = require('./routes/warehouses');

// Import db connection to initialize models
require('./models');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', itemRoutes);
app.use('/api', orderRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', warehouseRoutes);

module.exports = app;
