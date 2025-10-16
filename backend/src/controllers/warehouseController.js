const { WarehouseWeight } = require('../models').models;

module.exports = {
  async updateWeight(req, res) {
    const { warehouseId } = req.params;
    const { weight } = req.body;

    try {
      const [warehouseWeight, created] = await WarehouseWeight.findOrCreate({
        where: { warehouseId },
        defaults: { weight },
      });

      if (!created) {
        warehouseWeight.weight = weight;
        await warehouseWeight.save();
      }

      return res.json(warehouseWeight);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to update warehouse weight.' });
    }
  },

  async getWeights(req, res) {
    try {
      const weights = await WarehouseWeight.findAll();
      return res.json(weights);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to get warehouse weights.' });
    }
  },
};
