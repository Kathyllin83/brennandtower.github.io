const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { readData, writeData } = require('../services/jsonDbService');

const uploadCsv = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      try {
        const products = readData('products.json');
        const warehouses = readData('warehouses.json');
        const inventory = readData('inventory.json');

        results.forEach(row => {
          const { productCode, warehouseName, quantity, value, supplier } = row;

          // Find or create product
          let product = products.find(p => p.productCode === productCode);
          if (!product) {
            product = {
              id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              productCode,
              name: `New Product ${productCode}`, // Placeholder name
              supplier,
            };
            products.push(product);
          } else if (supplier) {
            product.supplier = supplier;
          }

          // Find warehouse
          const warehouse = warehouses.find(w => w.name.toLowerCase() === warehouseName.toLowerCase());
          if (!warehouse) {
            console.warn(`Warehouse not found for name: ${warehouseName}`);
            return; // Skip this row
          }

          // Find or create inventory entry
          let inventoryEntry = inventory.find(
            inv => inv.productId === product.id && inv.warehouseId === warehouse.id
          );

          if (inventoryEntry) {
            inventoryEntry.quantity = parseInt(inventoryEntry.quantity) + parseInt(quantity);
            inventoryEntry.value = parseFloat(value);
          } else {
            inventoryEntry = {
              id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              productId: product.id,
              warehouseId: warehouse.id,
              quantity: parseInt(quantity),
              value: parseFloat(value),
            };
            inventory.push(inventoryEntry);
          }
        });

        writeData('products.json', products);
        writeData('warehouses.json', warehouses);
        writeData('inventory.json', inventory);

        fs.unlinkSync(filePath); // Clean up uploaded file

        res.status(200).send({ message: 'CSV data processed and inventory updated successfully.' });
      } catch (error) {
        console.error('Error processing CSV data:', error);
        res.status(500).send('Error processing CSV data.');
      }
    });
};

const getInventoryByWarehouse = (req, res) => {
  try {
    const { warehouseId } = req.params;
    const inventory = readData('inventory.json');
    const products = readData('products.json');

    const warehouseInventory = inventory
      .filter(item => item.warehouseId === warehouseId)
      .map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          ...item,
          productName: product ? product.name : 'Unknown Product',
          productCode: product ? product.productCode : 'N/A',
        };
      });

    res.status(200).json(warehouseInventory);
  } catch (error) {
    console.error('Error getting inventory by warehouse:', error);
    res.status(500).send('Error retrieving inventory data.');
  }
};

const getInventoryStatus = (req, res) => {
    try {
        const inventory = readData('inventory.json');
        const products = readData('products.json');

        const inventoryWithStatus = inventory.map(item => {
            const percentage = (item.currentStock / item.initialStock) * 100;
            let status = 'Normal';
            if (item.currentStock === 0) {
                status = 'Crítico';
            } else if (percentage <= 20) {
                status = 'Atenção';
            }

            const product = products.find(p => p.id === item.productId);

            return {
                ...item,
                status,
                productName: product ? product.name : 'Unknown',
                sku: product ? product.sku : 'Unknown',
            };
        });

        res.json(inventoryWithStatus);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inventory status', error: error.message });
    }
};

module.exports = {
  uploadCsv,
  getInventoryByWarehouse,
  getInventoryStatus,
};
