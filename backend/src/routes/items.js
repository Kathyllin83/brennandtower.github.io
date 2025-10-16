const express = require('express');
const ItemController = require('../controllers/itemController');

const routes = express.Router();

routes.get('/items/low-stock', ItemController.getLowStock);
routes.get('/items', ItemController.index);
routes.get('/items/:id', ItemController.show);
routes.post('/items', ItemController.store);
routes.put('/items/:id', ItemController.update);
routes.delete('/items/:id', ItemController.destroy);

module.exports = routes;
