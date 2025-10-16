const db = require('../services/jsonDbService');

const getPeriodDates = (period) => {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case 'day':
      start.setDate(start.getDate() - 1);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
    default:
      start.setMonth(start.getMonth() - 1); // Default to month
  }

  return { start, end };
};

exports.getMetrics = async (req, res) => {
  const { period = 'month' } = req.query;

  try {
    const requests = await db.readData('requests');
    const products = await db.readData('products');
    const { start, end } = getPeriodDates(period);

    const completedRequests = requests.filter((r) => {
      const requestDate = new Date(r.createdAt);
      return r.status === 'COMPLETED' && requestDate >= start && requestDate <= end;
    });

    const sales = completedRequests.reduce((acc, request) => {
      request.products.forEach((p) => {
        acc[p.productId] = (acc[p.productId] || 0) + p.quantity;
      });
      return acc;
    }, {});

    if (Object.keys(sales).length === 0) {
        return res.json({ mostSold: null, leastSold: null });
    }

    const sortedSales = Object.entries(sales).sort(([, a], [, b]) => b - a);

    const mostSoldId = sortedSales[0][0];
    const leastSoldId = sortedSales[sortedSales.length - 1][0];

    const mostSold = await db.findById('products', mostSoldId);
    const leastSold = await db.findById('products', leastSoldId);

    res.json({
      mostSold: { ...mostSold, quantity: sortedSales[0][1] },
      leastSold: { ...leastSold, quantity: sortedSales[sortedSales.length - 1][1] },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.getPurchasePrediction = async (req, res) => {
    const cityWeights = { "Recife": 8, "São Paulo": 10, "Brasília": 7, "Curitiba": 5, "Manaus": 6 };
    const projectionDays = 30;

    try {
        const requests = await db.readData('requests');
        const inventory = await db.readData('inventory');
        const products = await db.readData('products');
        const warehouses = await db.readData('warehouses');

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentRequests = requests.filter(r => new Date(r.createdAt) >= thirtyDaysAgo && r.status === 'COMPLETED');

        const productSales = {};

        for (const request of recentRequests) {
            const warehouse = warehouses.find(w => w.id === request.originWarehouseId);
            const cityWeight = cityWeights[warehouse.city] || 1;

            for (const product of request.products) {
                if (!productSales[product.productId]) {
                    productSales[product.productId] = { totalQuantity: 0, weightedSum: 0, salesDays: new Set() };
                }
                productSales[product.productId].totalQuantity += product.quantity;
                productSales[product.productId].weightedSum += product.quantity * cityWeight;
                productSales[product.productId].salesDays.add(new Date(request.createdAt).toDateString());
            }
        }

        const suggestions = [];
        for (const productId in productSales) {
            const salesData = productSales[productId];
            const productInfo = products.find(p => p.id === productId);
            const totalStock = inventory.filter(i => i.productId === productId).reduce((sum, i) => sum + i.quantity, 0);

            const avgDailySales = salesData.totalQuantity / (salesData.salesDays.size || 1);
            const weightedAvg = salesData.weightedSum / (salesData.salesDays.size || 1);

            const projectedDemand = weightedAvg * projectionDays;

            if (totalStock < projectedDemand) {
                suggestions.push({
                    productName: productInfo.name,
                    sku: productInfo.sku,
                    reason: `Estoque atual (${totalStock}) é menor que a demanda projetada (${Math.ceil(projectedDemand)}) para os próximos ${projectionDays} dias.`,
                    suggestedQuantity: Math.ceil(projectedDemand - totalStock),
                });
            }
        }

        res.json(suggestions);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.getPurchasingDecision = async (req, res) => {
    try {
        // Re-using logic from getMetrics and getPurchasePrediction would be ideal,
        // but for simplicity, we call them and get the data directly.
        // In a real app, you'd refactor the logic into shared services.

        // 1. Key Metrics
        const metricsResponse = await exports.getMetrics({ query: { period: 'month' } }, { json: (data) => data, status: () => ({ send: () => {} }) });

        // 2. Purchase Suggestions
        const suggestionsResponse = await exports.getPurchasePrediction({}, { json: (data) => data, status: () => ({ send: () => {} }) });

        // 3. Critical Stock Alerts
        const inventory = await db.readData('inventory');
        const products = await db.readData('products');
        const warehouses = await db.readData('warehouses');
        const criticalStockLevel = 10;

        const criticalStockAlerts = inventory
            .filter(i => i.quantity < criticalStockLevel)
            .map(i => {
                const productInfo = products.find(p => p.id === i.productId);
                const warehouseInfo = warehouses.find(w => w.id === i.warehouseId);
                return {
                    productName: productInfo.name,
                    warehouse: warehouseInfo.name,
                    currentStock: i.quantity,
                };
            });

        res.json({
            reportGeneratedAt: new Date().toISOString(),
            keyMetrics: metricsResponse,
            purchaseSuggestions: suggestionsResponse,
            criticalStockAlerts,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};