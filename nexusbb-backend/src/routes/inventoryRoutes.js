const express = require('express');
const router = express.Router();
const {
  getWarehouseInventory,
  getCriticalStockAlerts,
  adjustInventory,
} = require('../controllers/inventoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Apply auth middleware to all inventory routes
router.use(authMiddleware);

// @route   GET /api/inventory/warehouse/:warehouseId
// @desc    Get inventory for a specific warehouse
// @access  Private (All roles, with specific checks in controller)
router.get('/warehouse/:warehouseId', getWarehouseInventory);

// @route   GET /api/inventory/alerts/critical
// @desc    Get all items with quantity below or at critical level
// @access  Private (CENTRAL_MANAGER)
router.get('/alerts/critical', roleMiddleware(['CENTRAL_MANAGER']), getCriticalStockAlerts);

// @route   POST /api/inventory/adjust
// @desc    Adjust inventory for a product in a warehouse
// @access  Private (CENTRAL_MANAGER)
router.post('/adjust', roleMiddleware(['CENTRAL_MANAGER']), adjustInventory);

module.exports = router;
