const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Private (CENTRAL_MANAGER)
router.post('/register', authMiddleware, roleMiddleware(['CENTRAL_MANAGER']), register);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', login);

module.exports = router;
