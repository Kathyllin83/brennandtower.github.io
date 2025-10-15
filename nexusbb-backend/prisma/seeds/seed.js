const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting database seeding...');

  // 1. Clean up the database to ensure idempotency
  console.log('🧹 Cleaning existing data...');
  await prisma.request.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.warehouse.deleteMany({});
  console.log('✅ Database cleaned.');

  // 2. Seed Warehouses from `dados_hackathon.xlsx - Sheet1.csv`
  console.log('🏭 Seeding warehouses...');
  const warehouseFilePath = path.join(__dirname, 'dados_hackathon.xlsx - Sheet1.csv');
  if (!fs.existsSync(warehouseFilePath)) {
    throw new Error('❌ Warehouse data file not found at prisma/seeds/dados_hackathon.xlsx - Sheet1.csv');
  }

  const workbook = xlsx.readFile(warehouseFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const warehousesData = xlsx.utils.sheet_to_json(worksheet);

  const createdWarehouses = [];
  for (let i = 0; i < warehousesData.length; i++) {
    const whData = warehousesData[i];
    const name = whData['NOME DO ARMAZÉM'];
    const city = whData['CIDADE'];

    if (name && city) {
      const warehouse = await prisma.warehouse.create({
        data: {
          name: name,
          city: city,
          type: i === 0 ? 'CENTRAL' : 'SATELLITE', // First is CENTRAL, rest are SATELLITE
        },
      });
      createdWarehouses.push(warehouse);
      console.log(`   -> Created warehouse: ${warehouse.name} (${warehouse.type})`);
    }
  }
  console.log('✅ Warehouses seeded.');

  // 3. Seed Users (Admin and Operators)
  console.log('👤 Seeding users...');
  const salt = await bcrypt.genSalt(10);

  // Create Central Manager
  const centralWarehouse = createdWarehouses.find(wh => wh.type === 'CENTRAL');
  if (centralWarehouse) {
    const adminPassword = await bcrypt.hash('admin123', salt);
    await prisma.user.create({
      data: {
        name: 'Admin Central',
        email: 'admin@nexus.bb',
        password: adminPassword,
        role: 'CENTRAL_MANAGER',
        warehouseId: centralWarehouse.id,
      },
    });
    console.log('   -> Created CENTRAL_MANAGER: admin@nexus.bb');
  }

  // Create Satellite Operators
  const satelliteWarehouses = createdWarehouses.filter(wh => wh.type === 'SATELLITE');
  for (const satellite of satelliteWarehouses) {
    const operatorPassword = await bcrypt.hash('operador123', salt);
    const email = `operador.${satellite.city.toLowerCase().replace(/\s+/g, '')}@nexus.bb`;
    await prisma.user.create({
      data: {
        name: `Operador ${satellite.city}`,
        email: email,
        password: operatorPassword,
        role: 'SATELLITE_OPERATOR',
        warehouseId: satellite.id,
      },
    });
    console.log(`   -> Created SATELLITE_OPERATOR: ${email}`);
  }
  console.log('✅ Users seeded.');

  // 4. Seed Products and Inventory from `dados_hackathon.csv`
  console.log('📦 Seeding products and inventory...');
  const inventoryFilePath = path.join(__dirname, 'dados_hackathon.csv');
  if (!fs.existsSync(inventoryFilePath)) {
    throw new Error('❌ Inventory data file not found at prisma/seeds/dados_hackathon.csv');
  }

  const warehouseMap = new Map(createdWarehouses.map(wh => [wh.name, wh.id]));
  const stream = fs.createReadStream(inventoryFilePath).pipe(csv());

  for await (const row of stream) {
    const sku = row['SKU'];
    const productName = row['NOME_PRODUTO'];
    const category = row['CATEGORIA'];
    const warehouseName = row['ARMAZEM'];
    const quantity = parseInt(row['QUANTIDADE'], 10);

    if (!sku || !productName || !warehouseName || isNaN(quantity)) continue;

    const warehouseId = warehouseMap.get(warehouseName);
    if (!warehouseId) continue;

    // Upsert Product to avoid duplicates
    const product = await prisma.product.upsert({
      where: { sku: sku },
      update: { name: productName, category: category },
      create: {
        sku: sku,
        name: productName,
        category: category,
        description: `Descrição para ${productName}`,
      },
    });

    // Create Inventory record
    await prisma.inventory.create({
      data: {
        productId: product.id,
        warehouseId: warehouseId,
        quantity: quantity,
        criticalLevel: 10, // Default critical level
      },
    });
  }
  console.log('✅ Products and inventory seeded.');

  console.log('🎉 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ An error occurred during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
