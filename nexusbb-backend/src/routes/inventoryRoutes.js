const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/status', inventoryController.getInventoryStatus);
router.get('/:warehouseId', inventoryController.getInventoryByWarehouse);

module.exports = router;