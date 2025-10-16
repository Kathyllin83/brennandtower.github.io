const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');

router.get('/warehouses/weights', warehouseController.getWeights);
router.put('/warehouses/:warehouseId/weight', warehouseController.updateWeight);

module.exports = router;
