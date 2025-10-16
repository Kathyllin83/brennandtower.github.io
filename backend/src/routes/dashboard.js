const express = require('express');
const DashboardController = require('../controllers/dashboardController');

const routes = express.Router();

routes.get('/dashboard/metrics', DashboardController.getMetrics);
routes.get('/dashboard/prediction', DashboardController.getPrediction);

module.exports = routes;
