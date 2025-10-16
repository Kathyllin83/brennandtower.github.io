const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 3001;

// Sync database and start server
db.sync({ force: true })
  .then(async () => {
    console.log('Database synced!');

    // Seed data
    const Warehouse = db.models.Warehouse;
    const Item = db.models.Item;
    const Order = db.models.Order;

    // 1. Create Warehouses
    await Warehouse.bulkCreate([
      { id: 1, name: 'Central', location: 'Brasília - DF' },
      { id: 2, name: 'Recife', location: 'Recife - PE' },
      { id: 3, name: 'Curitiba', location: 'Curitiba - PR' },
    ]);
    console.log('Warehouses seeded!');

    // 2. Create Items (None in Central)
    await Item.bulkCreate([
      // Warehouse 1 (Central)
      { name: 'Notebook Dell Vostro', quantity: 150, status: 'Disponível', warehouseId: 1, imageUrl: 'https://placehold.co/600x400/7c3aed/white?text=Notebook', code: 'NOT-DELL-VOS', value: 4500.00, supplier: 'Dell Brasil' },
      { name: 'Servidor PowerEdge', quantity: 20, status: 'Disponível', warehouseId: 1, imageUrl: 'https://placehold.co/600x400/7c3aed/white?text=Servidor', code: 'SRV-DELL-PE', value: 15000.00, supplier: 'Dell Brasil' },
      { name: 'Switch 24 Portas', quantity: 30, status: 'Disponível', warehouseId: 1, imageUrl: 'https://placehold.co/600x400/7c3aed/white?text=Switch', code: 'SWT-24P-01', value: 1800.00, supplier: 'Fornecedor Infra' },
      { name: 'Roteador Cisco', quantity: 25, status: 'Disponível', warehouseId: 1, imageUrl: 'https://placehold.co/600x400/7c3aed/white?text=Roteador', code: 'ROT-CIS-01', value: 2500.00, supplier: 'Cisco Brasil' },

      // Warehouse 2 (Recife)
      { name: 'Placa Mãe AM4', quantity: 50, status: 'Disponível', warehouseId: 2, imageUrl: 'https://placehold.co/600x400/2563eb/white?text=Placa+Mãe', code: 'PM-AM4-01', value: 750.00, supplier: 'Fornecedor Tech' },
      { name: 'Monitor Dell 24\"', quantity: 8, status: 'Atenção', warehouseId: 2, imageUrl: 'https://placehold.co/600x400/2563eb/white?text=Monitor', code: 'MON-DELL-24', value: 1200.50, supplier: 'Dell Brasil' },
      { name: 'Mouse Gamer Logitech', quantity: 100, status: 'Disponível', warehouseId: 2, imageUrl: 'https://placehold.co/600x400/2563eb/white?text=Mouse', code: 'MSE-LOG-G502', value: 350.00, supplier: 'Logitech BR' },
      { name: 'Cabo HDMI 2m', quantity: 5, status: 'Crítico', warehouseId: 2, imageUrl: 'https://placehold.co/600x400/2563eb/white?text=Cabo+HDMI', code: 'CBL-HDMI-2M', value: 45.90, supplier: 'Fornecedor Tech' },
      { name: 'Processador Ryzen 5', quantity: 45, status: 'Disponível', warehouseId: 2, imageUrl: 'https://placehold.co/600x400/2563eb/white?text=Ryzen+5', code: 'CPU-R5-5600X', value: 1500.00, supplier: 'AMD Brasil' },
      { name: 'Memória RAM 8GB DDR4', quantity: 150, status: 'Disponível', warehouseId: 2, imageUrl: 'https://placehold.co/600x400/2563eb/white?text=RAM+8GB', code: 'RAM-DDR4-8G', value: 280.00, supplier: 'Fornecedor Tech' },

      // Warehouse 3 (Curitiba)
      { name: 'SSD 1TB Kingston', quantity: 0, status: 'Crítico', warehouseId: 3, imageUrl: 'https://placehold.co/600x400/2563eb/white?text=SSD', code: 'SSD-KIN-1TB', value: 600.00, supplier: 'Kingston BR' },
      { name: 'Teclado Mecânico Redragon', quantity: 25, status: 'Disponível', warehouseId: 3, imageUrl: 'https://placehold.co/600x400/2563eb/white?text=Teclado', code: 'KBD-RED-K552', value: 299.90, supplier: 'Redragon' },
      { name: 'Webcam Full HD', quantity: 40, status: 'Disponível', warehouseId: 3, imageUrl: 'https://placehold.co/600x400/2563eb/white?text=Webcam', code: 'CAM-FHD-01', value: 180.00, supplier: 'Fornecedor Tech' },
      { name: 'Fonte ATX 500W', quantity: 3, status: 'Crítico', warehouseId: 3, imageUrl: 'https://placehold.co/600x400/2563eb/white?text=Fonte+ATX', code: 'PSU-500W-01', value: 350.00, supplier: 'Fornecedor Tech' },
      { name: 'Gabinete Gamer', quantity: 12, status: 'Disponível', warehouseId: 3, imageUrl: 'https://placehold.co/600x400/2563eb/white?text=Gabinete', code: 'CASE-GAMER-01', value: 450.00, supplier: 'Fornecedor Tech' },
      { name: 'Placa de Vídeo RTX 3060', quantity: 9, status: 'Atenção', warehouseId: 3, imageUrl: 'https://placehold.co/600x400/2563eb/white?text=RTX+3060', code: 'GPU-RTX-3060', value: 2800.00, supplier: 'Nvidia Brasil' },
    ]);
    console.log('Items seeded!');

    // 3. Create Orders
    await Order.bulkCreate([
      { type: 'Requisição', originWarehouseId: 2, destinationWarehouseId: 3, itemId: 1, quantity: 5, status: 'Entregue' },
      { type: 'Requisição', originWarehouseId: 3, destinationWarehouseId: 2, itemId: 4, quantity: 10, status: 'Em Andamento' },
      { type: 'Requisição', originWarehouseId: 2, destinationWarehouseId: 3, itemId: 2, quantity: 2, status: 'Aberto' },
      { type: 'Requisição', originWarehouseId: 2, destinationWarehouseId: 1, itemId: 5, quantity: 20, status: 'Entregue' },
      { type: 'Requisição', originWarehouseId: 3, destinationWarehouseId: 1, itemId: 11, quantity: 5, status: 'Em Andamento' },
      { type: 'Reparo', originWarehouseId: 2, destinationWarehouseId: 1, itemId: 7, quantity: 1, status: 'Encerrado' },
      { type: 'Reparo', originWarehouseId: 3, destinationWarehouseId: 1, itemId: 3, quantity: 1, status: 'Em Andamento' },
      { type: 'Requisição', destinationWarehouseId: 2, itemId: 5, quantity: 50, status: 'Entregue' },
      { type: 'Requisição', destinationWarehouseId: 3, itemId: 6, quantity: 30, status: 'Aberto' },
      { type: 'Requisição', destinationWarehouseId: 2, itemId: 1, quantity: 20, status: 'Em Andamento' },
    ]);
    console.log('Orders seeded!');

  })
  .then(() => {
    // Health (bate com o HEALTHCHECK do Dockerfile)
    app.get('/health', (req, res) => res.json({ status: 'ok' }));

    // === SERVIR FRONTEND (Vite) ===
    const frontendDist = path.resolve(__dirname, '../../frontend/dist');
    const indexHtml = path.join(frontendDist, 'index.html');

    console.log('[STATIC] Tentando servir:', frontendDist);
    console.log('[STATIC] index.html existe?', fs.existsSync(indexHtml));

    // 1) Confere se o build existe dentro do container
    if (!fs.existsSync(frontendDist)) {
      console.error('[STATIC] Pasta dist NÃO encontrada. Verifique build do Vite e Dockerfile COPY.');
    }
    if (!fs.existsSync(indexHtml)) {
      console.error('[STATIC] index.html NÃO encontrado em dist. O build realmente rodou?');
    }

    // 2) Rotas de API já estão montadas em ./app (antes do static)
    app.use(express.static(frontendDist));

    // 3) Rota raiz explícita (ajuda a depurar)
    app.get('/', (req, res) => {
      if (fs.existsSync(indexHtml)) return res.sendFile(indexHtml);
      return res.status(500).send('index.html não encontrado em /frontend/dist');
    });

    // 4) Fallback SPA para rotas do React (DEPOIS das rotas /api)
    app.get('*', (req, res) => {
      res.sendFile(indexHtml);
    });

    // 5) Escutar em 0.0.0.0 no Docker
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
