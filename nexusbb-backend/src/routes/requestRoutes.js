const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
} = require('../controllers/requestController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Apply auth middleware to all request routes
router.use(authMiddleware);

// @route   GET /api/requests
// @desc    Get all requests (for central manager)
// @access  Private (CENTRAL_MANAGER)
router.get('/', roleMiddleware(['CENTRAL_MANAGER']), getAllRequests);

// @route   POST /api/requests
// @desc    Create a new request
// @access  Private (SATELLITE_OPERATOR)
router.post('/', roleMiddleware(['SATELLITE_OPERATOR']), createRequest);

// @route   GET /api/requests/my-requests
// @desc    Get all requests for the logged-in satellite operator
// @access  Private (SATELLITE_OPERATOR)
router.get('/my-requests', roleMiddleware(['SATELLITE_OPERATOR']), getMyRequests);

// @route   PUT /api/requests/:id/status
// @desc    Update the status of a request
// @access  Private (CENTRAL_MANAGER)
router.put('/:id/status', roleMiddleware(['CENTRAL_MANAGER']), updateRequestStatus);

module.exports = router;
