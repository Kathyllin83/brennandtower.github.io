const prisma = require('../config/prisma');

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Private (All roles)
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (CENTRAL_MANAGER)
 */
exports.createProduct = async (req, res) => {
  const { sku, name, description, category } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: { sku, name, description, category },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private (CENTRAL_MANAGER)
 */
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { sku, name, description, category } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { sku, name, description, category },
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private (CENTRAL_MANAGER)
 */
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
