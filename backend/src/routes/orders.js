const express = require('express');
const OrderController = require('../controllers/orderController');

const routes = express.Router();

routes.get('/orders', OrderController.index);
routes.get('/orders/:id', OrderController.show);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);

module.exports = routes;
