const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/metrics', reportController.getMetrics);
router.get('/purchase-prediction', reportController.getPurchasePrediction);
router.get('/purchasing-decision', reportController.getPurchasingDecision);

module.exports = router;
