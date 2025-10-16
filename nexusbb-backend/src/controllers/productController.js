const jsonDbService = require('../services/jsonDbService');
const { v4: uuidv4 } = require('uuid');

const getProducts = (req, res) => {
    try {
        const inventory = jsonDbService.readData('inventory.json');
        const products = jsonDbService.readData('products.json');
        const warehouses = jsonDbService.readData('warehouses.json');

        const populatedInventory = inventory.map(item => {
            const product = products.find(p => p.id === item.productId);
            const warehouse = warehouses.find(w => w.id === item.warehouseId);
            return {
                ...item,
                productName: product ? product.name : 'Unknown',
                sku: product ? product.sku : 'Unknown',
                supplier: product ? product.supplier : 'Unknown',
                warehouseCity: warehouse ? warehouse.city : 'Unknown',
            };
        });
        res.json(populatedInventory);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

const addProduct = (req, res) => {
    const { name, sku, supplier, initialStock, warehouseId } = req.body;

    if (!name || !sku || !supplier || !initialStock || !warehouseId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const products = jsonDbService.readData('products.json');
        const inventory = jsonDbService.readData('inventory.json');

        const newProductId = uuidv4();
        const newProduct = { id: newProductId, name, sku, supplier };
        products.push(newProduct);
        jsonDbService.writeData('products.json', products);

        const newInventoryItem = {
            id: uuidv4(),
            productId: newProductId,
            warehouseId,
            initialStock,
            currentStock: initialStock,
        };
        inventory.push(newInventoryItem);
        jsonDbService.writeData('inventory.json', inventory);

        res.status(201).json({ product: newProduct, inventory: newInventoryItem });
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
};

const updateProduct = (req, res) => {
    const { inventoryId } = req.params;
    const { currentStock } = req.body;

    if (currentStock === undefined) {
        return res.status(400).json({ message: 'currentStock is required' });
    }

    try {
        const inventory = jsonDbService.readData('inventory.json');
        const itemIndex = inventory.findIndex(item => item.id === inventoryId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        inventory[itemIndex].currentStock = currentStock;
        jsonDbService.writeData('inventory.json', inventory);

        res.json(inventory[itemIndex]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

const deleteProduct = (req, res) => {
    const { inventoryId } = req.params;

    try {
        let inventory = jsonDbService.readData('inventory.json');
        const initialLength = inventory.length;
        
        inventory = inventory.filter(item => item.id !== inventoryId);

        if (inventory.length === initialLength) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        jsonDbService.writeData('inventory.json', inventory);

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};


module.exports = {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
};