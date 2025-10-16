const { Item, Order } = require('./models').models;

const items = [
  // Warehouse 1 (Central)
  { name: 'Cadeira de Escritório Ergonômica', imageUrl: 'https://picsum.photos/seed/chair/400/300', code: 'CAD-001', value: 350.00, supplier: 'Fornecedor A', quantity: 50, status: 'Disponível', warehouseId: 1 },
  { name: 'Mesa de Reunião 8 Lugares', imageUrl: 'https://picsum.photos/seed/table/400/300', code: 'MES-002', value: 1200.00, supplier: 'Fornecedor B', quantity: 10, status: 'Disponível', warehouseId: 1 },
  { name: 'Projetor Full HD', imageUrl: 'https://picsum.photos/seed/projector/400/300', code: 'PRO-003', value: 2500.00, supplier: 'Fornecedor C', quantity: 5, status: 'Crítico', warehouseId: 1 },
  { name: 'Quadro Branco Magnético', imageUrl: 'https://picsum.photos/seed/whiteboard/400/300', code: 'QUA-004', value: 150.00, supplier: 'Fornecedor A', quantity: 20, status: 'Disponível', warehouseId: 1 },
  { name: 'Ar Condicionado Split 12000 BTUs', imageUrl: 'https://picsum.photos/seed/ac/400/300', code: 'AR-005', value: 1800.00, supplier: 'Fornecedor D', quantity: 8, status: 'Disponível', warehouseId: 1 },

  // Warehouse 2 (Recife)
  { name: 'Notebook Dell Inspiron 15', imageUrl: 'https://picsum.photos/seed/laptop/400/300', code: 'NOT-006', value: 3200.00, supplier: 'Fornecedor E', quantity: 30, status: 'Disponível', warehouseId: 2 },
  { name: 'Monitor LED 24 polegadas', imageUrl: 'https://picsum.photos/seed/monitor/400/300', code: 'MON-007', value: 800.00, supplier: 'Fornecedor E', quantity: 40, status: 'Disponível', warehouseId: 2 },
  { name: 'Teclado Mecânico Gamer', imageUrl: 'https://picsum.photos/seed/keyboard/400/300', code: 'TEC-008', value: 450.00, supplier: 'Fornecedor F', quantity: 15, status: 'Em Reparo', warehouseId: 2 },
  { name: 'Mouse sem Fio Logitech', imageUrl: 'https://picsum.photos/seed/mouse/400/300', code: 'MOU-009', value: 120.00, supplier: 'Fornecedor F', quantity: 25, status: 'Disponível', warehouseId: 2 },
  { name: 'Impressora Multifuncional HP', imageUrl: 'https://picsum.photos/seed/printer/400/300', code: 'IMP-010', value: 650.00, supplier: 'Fornecedor G', quantity: 3, status: 'Crítico', warehouseId: 2 },

  // Warehouse 3 (Curitiba)
  { name: 'Smartphone Samsung Galaxy S23', imageUrl: 'https://picsum.photos/seed/phone/400/300', code: 'CEL-011', value: 4500.00, supplier: 'Fornecedor H', quantity: 20, status: 'Disponível', warehouseId: 3 },
  { name: 'Tablet Apple iPad Air', imageUrl: 'https://picsum.photos/seed/tablet/400/300', code: 'TAB-012', value: 5800.00, supplier: 'Fornecedor I', quantity: 12, status: 'Disponível', warehouseId: 3 },
  { name: 'Smartwatch Garmin Forerunner', imageUrl: 'https://picsum.photos/seed/watch/400/300', code: 'SMR-013', value: 1900.00, supplier: 'Fornecedor J', quantity: 18, status: 'Disponível', warehouseId: 3 },
  { name: 'Câmera de Segurança Intelbras', imageUrl: 'https://picsum.photos/seed/camera/400/300', code: 'CAM-014', value: 300.00, supplier: 'Fornecedor K', quantity: 40, status: 'Disponível', warehouseId: 3 },
  { name: 'Roteador Wi-Fi 6 TP-Link', imageUrl: 'https://picsum.photos/seed/router/400/300', code: 'ROT-015', value: 550.00, supplier: 'Fornecedor L', quantity: 2, status: 'Crítico', warehouseId: 3 },
];

async function seed() {
  try {
    console.log('Syncing database...');
    await require('./models'); // Ensures connection and models are ready

    console.log('Clearing existing data...');
    await Order.destroy({ where: {}, truncate: true });
    await Item.destroy({ where: {}, truncate: true });

    console.log('Seeding items...');
    await Item.bulkCreate(items);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    process.exit();
  }
}

seed();