const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Apply auth middleware to all product routes
router.use(authMiddleware);

// @route   GET /api/products
// @desc    Get all products
// @access  Private (All roles)
router.get('/', getAllProducts);

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (CENTRAL_MANAGER)
router.post('/', roleMiddleware(['CENTRAL_MANAGER']), createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (CENTRAL_MANAGER)
router.put('/:id', roleMiddleware(['CENTRAL_MANAGER']), updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (CENTRAL_MANAGER)
router.delete('/:id', roleMiddleware(['CENTRAL_MANAGER']), deleteProduct);

module.exports = router;
