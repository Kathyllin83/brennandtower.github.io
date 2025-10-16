const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/metrics', dashboardController.getMetrics);
router.get('/purchase-recommendations', dashboardController.getPurchaseRecommendations);

module.exports = router;