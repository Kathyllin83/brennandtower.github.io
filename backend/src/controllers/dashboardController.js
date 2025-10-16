const { Order, Item, Warehouse, WarehouseWeight } = require('../models').models;
const { Op, fn, col, literal } = require('sequelize');
const { subMonths } = require('date-fns');

module.exports = {
  async getMetrics(req, res) {
    const { timePeriod = '3m', warehouseId, itemId } = req.query;

    const months = timePeriod === '6m' ? 6 : 3;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    try {
      const weightsData = await WarehouseWeight.findAll();
      const weights = weightsData.reduce((acc, ww) => {
        acc[ww.warehouseId] = ww.weight;
        return acc;
      }, {});

      let totalWeights = 0;
      let weightedSalesSum = 0;

      const warehousesToIterate = warehouseId ? { [warehouseId]: weights[warehouseId] || 1 } : weights;

      for (const whId in warehousesToIterate) {
        const whereClause = {
          type: 'Requisição',
          originWarehouseId: whId,
          createdAt: { [Op.gte]: startDate },
        };
        if (itemId) whereClause.itemId = itemId;

        const sales = await Order.sum('quantity', { where: whereClause });
        const weight = weights[whId] || 1;
        weightedSalesSum += (sales || 0) * weight;
        totalWeights += weight;
      }
      const weightedSalesAverage = totalWeights > 0 ? weightedSalesSum / totalWeights / months : 0;

      const TARGET_STOCK_LEVEL = 100;
      const itemWhereClause = {};
      if (warehouseId) itemWhereClause.warehouseId = warehouseId;
      if (itemId) itemWhereClause.id = itemId;

      const allItems = await Item.findAll({ where: itemWhereClause });
      const restockList = [];
      allItems.forEach(item => {
        if (item.quantity < TARGET_STOCK_LEVEL) {
          restockList.push({
            name: item.name,
            quantityToBuy: TARGET_STOCK_LEVEL - item.quantity
          });
        }
      });

      const topItemsWhereClause = {
        type: 'Requisição',
        createdAt: { [Op.gte]: startDate },
      };
      if (warehouseId) topItemsWhereClause.originWarehouseId = warehouseId;
      if (itemId) topItemsWhereClause.itemId = itemId;

      const topItems = await Order.findAll({
        where: topItemsWhereClause,
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
      const { timePeriod = '3m', warehouseId, itemId } = req.query;
      const months = timePeriod === '6m' ? 6 : 3;
  
      const currentDate = new Date();
      const currentPeriodStart = subMonths(currentDate, months);
      const previousPeriodStart = subMonths(currentDate, months * 2);
      const previousPeriodEnd = currentPeriodStart;
  
      const topItemResult = await Order.findOne({
        attributes: [
          'itemId',
          [fn('COUNT', col('Order.id')), 'orderCount']
        ],
        where: {
          type: 'Requisição',
          createdAt: { [Op.between]: [currentPeriodStart, currentDate] },
          ...(warehouseId && { destinationWarehouseId: warehouseId }),
          ...(itemId && { itemId: itemId }),
        },
        include: [{ model: Item, as: 'item', attributes: ['name', 'quantity'] }],
        group: ['itemId', 'item.id', 'item.name', 'item.quantity'],
        order: [[literal('orderCount'), 'DESC']],
      });
  
      if (!topItemResult) {
        return res.json({ prediction: "Não há dados de requisições suficientes para gerar uma recomendação." });
      }
  
      const topItemId = topItemResult.get('itemId');
      const topItemName = topItemResult.item.name;
      const currentCount = parseInt(topItemResult.get('orderCount'), 10);
      
      const previousCountResult = await Order.count({
        where: {
          itemId: topItemId,
          type: 'Requisição',
          createdAt: { [Op.between]: [previousPeriodStart, previousPeriodEnd] },
          ...(warehouseId && { destinationWarehouseId: warehouseId }),
        },
      });
  
      let prediction = '';

      if (previousCountResult === 0 && currentCount > 5) {
        const quantityToBuy = Math.ceil(currentCount * 2);
        prediction = `O item "${topItemName}" é uma novidade com alta demanda (${currentCount} requisições). Considere fazer uma compra inicial de ${quantityToBuy} unidades para suprir a necessidade.`;
      
      } else if (previousCountResult > 0 && currentCount > previousCountResult) {
        const percentageIncrease = ((currentCount - previousCountResult) / previousCountResult) * 100;
        const quantityToBuy = Math.ceil(currentCount * 1.2);
        prediction = `A demanda pelo item "${topItemName}" aumentou ${percentageIncrease.toFixed(0)}% nos últimos ${months} meses. Com base nesta performance, uma compra estratégica de ${quantityToBuy} unidades é uma sugestão viável para antecipar a demanda futura.`;
      
      } else {
        const quantityToBuy = Math.ceil(currentCount * 1.1);
        prediction = `O item "${topItemName}" mantém uma performance de vendas forte e consistente. Para capitalizar sobre essa demanda sólida, uma compra de ${quantityToBuy} unidades pode garantir a continuidade do atendimento e preparar o estoque para picos de mercado.`;
      }
      
      return res.json({ prediction });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to generate prediction.' });
    }
  }
};