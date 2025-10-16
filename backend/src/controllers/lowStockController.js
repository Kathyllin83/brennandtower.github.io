const { Item } = require('../models').models;
const { Op } = require('sequelize');

module.exports = {
  // ... other methods

  async getLowStock(req, res) {
    try {
      const lowStockItems = await Item.findAll({
        where: {
          [Op.or]: [
            { status: 'Crítico' },
            { quantity: { [Op.lte]: 10 } }
          ]
        },
        include: 'warehouse'
      });
      return res.json(lowStockItems);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get low stock items.' });
    }
  }
};