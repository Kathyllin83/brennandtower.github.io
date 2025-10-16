const jsonDbService = require('../services/jsonDbService');

const getMetrics = (req, res) => {
    try {
        const sales = jsonDbService.readData('sales.json');
        const products = jsonDbService.readData('products.json');
        const warehouses = jsonDbService.readData('warehouses.json');

        const salesByProduct = sales.reduce((acc, sale) => {
            const key = `${sale.productId}-${sale.warehouseId}`;
            if (!acc[key]) {
                acc[key] = {
                    productId: sale.productId,
                    warehouseId: sale.warehouseId,
                    totalSold: 0,
                };
            }
            acc[key].totalSold += sale.quantitySold;
            return acc;
        }, {});

        const topSoldProducts = Object.values(salesByProduct)
            .sort((a, b) => b.totalSold - a.totalSold)
            .map(item => {
                const product = products.find(p => p.id === item.productId);
                const warehouse = warehouses.find(w => w.id === item.warehouseId);
                return {
                    productName: product ? product.name : 'Unknown',
                    warehouseCity: warehouse ? warehouse.city : 'Unknown',
                    totalSold: item.totalSold,
                };
            });

        res.json({ topSoldProducts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching metrics', error: error.message });
    }
};

const getPurchaseRecommendations = (req, res) => {
    try {
        const sales = jsonDbService.readData('sales.json');
        const inventory = jsonDbService.readData('inventory.json');
        const products = jsonDbService.readData('products.json');

        if (sales.length === 0) {
            return res.json({ recommendations: [] });
        }

        const salesByProduct = {};
        sales.forEach(sale => {
            if (!salesByProduct[sale.productId]) {
                salesByProduct[sale.productId] = [];
            }
            salesByProduct[sale.productId].push(sale);
        });

        const recommendations = [];
        for (const productId in salesByProduct) {
            const productSales = salesByProduct[productId];
            const firstSaleDate = new Date(productSales[0].saleDate);
            const lastSaleDate = new Date(productSales[productSales.length - 1].saleDate);
            const days = Math.max(1, (lastSaleDate - firstSaleDate) / (1000 * 60 * 60 * 24));
            const totalSold = productSales.reduce((sum, sale) => sum + sale.quantitySold, 0);
            const avgDailySales = totalSold / days;

            const inventoryItem = inventory.find(item => item.productId === productId);
            if (inventoryItem) {
                const projectedNeed = avgDailySales * 30;
                if (inventoryItem.currentStock < projectedNeed) {
                    const product = products.find(p => p.id === productId);
                    recommendations.push({
                        productName: product ? product.name : 'Unknown',
                        reason: 'Alta velocidade de vendas',
                        suggestedPurchaseQuantity: Math.ceil(projectedNeed - inventoryItem.currentStock),
                    });
                }
            }
        }

        res.json({ recommendations });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
    }
};

module.exports = {
    getMetrics,
    getPurchaseRecommendations,
};