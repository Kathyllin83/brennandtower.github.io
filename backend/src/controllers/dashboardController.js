const { Order, Item, Warehouse } = require('../models').models;
const { Op, fn, col, literal } = require('sequelize');

module.exports = {
  async getMetrics(req, res) {
    const { timePeriod = '3m' } = req.query;

    const months = timePeriod === '6m' ? 6 : 3;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    try {
      // 1. Weighted Sales Average
      const weights = { '1': 1, '2': 3, '3': 2 }; // Brasília, Recife, Curitiba
      const totalWeights = 6;
      let weightedSalesSum = 0;

      for (const warehouseId in weights) {
        const sales = await Order.sum('quantity', {
          where: {
            type: 'Requisição',
            originWarehouseId: warehouseId,
            createdAt: { [Op.gte]: startDate },
          }
        });
        weightedSalesSum += (sales || 0) * weights[warehouseId];
      }
      const weightedSalesAverage = weightedSalesSum / totalWeights / months;

      // 2. Restock Recommendation
      const TARGET_STOCK_LEVEL = 100;
      const allItems = await Item.findAll();
      const restockList = [];
      allItems.forEach(item => {
        if (item.quantity < TARGET_STOCK_LEVEL) {
          restockList.push({
            name: item.name,
            quantityToBuy: TARGET_STOCK_LEVEL - item.quantity
          });
        }
      });

      // 3. Top Items (preserved logic)
      const topItems = await Order.findAll({
        where: { type: 'Requisição', createdAt: { [Op.gte]: startDate } },
        attributes: [[fn('COUNT', col('itemId')), 'count']],
        include: [{ model: Item, as: 'item', attributes: ['name'] }],
        group: ['itemId', 'item.id', 'item.name'],
        order: [[literal('count'), 'DESC']],
        limit: 5,
      });
      const topItemsByWarehouse = { 'all': topItems.map(i => ({ name: i.item.name, count: i.get('count') })) };

      return res.json({ weightedSalesAverage, restockList, topItemsByWarehouse });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to calculate metrics.' });
    }
  },

  async getPrediction(req, res) {
    try {
      // Find top requested item in the last 3 months
      const topItemOrder = await Order.findOne({
        where: { type: 'Requisição', createdAt: { [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 3)) } },
        attributes: [[fn('COUNT', col('itemId')), 'count']],
        group: ['itemId'],
        order: [[literal('count'), 'DESC']],
      });

      if (!topItemOrder) {
        return res.json({ prediction: 'Não há dados de requisições suficientes para gerar uma predição.' });
      }

      const topItemId = topItemOrder.get('itemId');
      const topItem = await Item.findByPk(topItemId);

      if (!topItem) {
        return res.json({ prediction: 'Análise de estoque em andamento.' });
      }

      // Simple prediction logic
      if (topItem.quantity < 20) {
        const recommendationQty = 100 - topItem.quantity;
        return res.json({ prediction: `O item '${topItem.name}' é o mais requisitado e está com estoque baixo (${topItem.quantity} un.). Considere comprar ${recommendationQty} novas unidades.` });
      } else {
        return res.json({ prediction: `O item mais requisitado, '${topItem.name}', está com estoque saudável. Nenhuma ação é necessária no momento.` });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to generate prediction.' });
    }
  }
};
