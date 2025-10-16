const jsonDbService = require('../services/jsonDbService');
const { v4: uuidv4 } = require('uuid');

const registerSale = (req, res) => {
    const { inventoryId, quantity } = req.body;

    if (!inventoryId || !quantity) {
        return res.status(400).json({ message: 'inventoryId and quantity are required' });
    }

    try {
        const inventory = jsonDbService.readData('inventory.json');
        const sales = jsonDbService.readData('sales.json');

        const inventoryItemIndex = inventory.findIndex(item => item.id === inventoryId);

        if (inventoryItemIndex === -1) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        const inventoryItem = inventory[inventoryItemIndex];

        if (inventoryItem.currentStock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        inventoryItem.currentStock -= quantity;
        jsonDbService.writeData('inventory.json', inventory);

        const newSale = {
            id: uuidv4(),
            productId: inventoryItem.productId,
            warehouseId: inventoryItem.warehouseId,
            quantitySold: quantity,
            saleDate: new Date().toISOString(),
        };

        sales.push(newSale);
        jsonDbService.writeData('sales.json', sales);

        res.status(201).json(newSale);
    } catch (error) {
        res.status(500).json({ message: 'Error processing sale', error: error.message });
    }
};

module.exports = {
    registerSale,
};