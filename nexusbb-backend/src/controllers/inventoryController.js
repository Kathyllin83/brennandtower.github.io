const prisma = require('../config/prisma');

/**
 * @route   GET /api/inventory/warehouse/:warehouseId
 * @desc    Get inventory for a specific warehouse
 * @access  Private (All roles)
 */
exports.getWarehouseInventory = async (req, res) => {
  const { warehouseId } = req.params;
  const { user } = req;

  try {
    // Security check: Satellite operators can only see their own warehouse inventory
    if (user.role === 'SATELLITE_OPERATOR' && user.warehouseId !== warehouseId) {
      return res.status(403).json({ message: 'Forbidden: You can only access your own warehouse inventory' });
    }

    const inventory = await prisma.inventory.findMany({
      where: { warehouseId },
      include: { product: true, warehouse: true },
    });

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found for this warehouse' });
    }

    res.json(inventory);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

/**
 * @route   GET /api/inventory/alerts/critical
 * @desc    Get all items with quantity below or at critical level
 * @access  Private (CENTRAL_MANAGER)
 */
exports.getCriticalStockAlerts = async (req, res) => {
  try {
    const criticalItems = await prisma.inventory.findMany({
      where: {
        quantity: {
          lte: prisma.inventory.fields.criticalLevel, // This is a pseudo-code way to express the idea.
                                                      // Prisma requires a raw query or a different approach for this.
        },
      },
      include: { product: true, warehouse: true },
    });
    
    // Correct way to compare two fields in Prisma
    const items = await prisma.$queryRaw`
      SELECT * FROM "Inventory" i
      LEFT JOIN "Product" p ON i."productId" = p.id
      LEFT JOIN "Warehouse" w ON i."warehouseId" = w.id
      WHERE i."QUANTIDADE" <= i."criticalLevel";
    `

    res.json(items);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

/**
 * @route   POST /api/inventory/adjust
 * @desc    Adjust inventory for a product in a warehouse
 * @access  Private (CENTRAL_MANAGER)
 */
exports.adjustInventory = async (req, res) => {
  const { productId, warehouseId, newQuantity } = req.body;

  try {
    const updatedInventoryItem = await prisma.inventory.update({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
      data: {
        quantity: newQuantity,
      },
    });

    res.json(updatedInventoryItem);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
