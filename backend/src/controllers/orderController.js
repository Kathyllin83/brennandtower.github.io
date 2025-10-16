const Order = require('../models/Order');

module.exports = {
  async index(req, res) {
    const { type, sort = 'desc' } = req.query;

    let where = {};
    if (type) {
      where.type = type;
    }

    try {
      const orders = await Order.findAll({
        where,
        include: [
          { association: 'item' },
          { association: 'originWarehouse' },
          { association: 'destinationWarehouse' },
        ],
        order: [['createdAt', sort.toUpperCase()]]
      });
      return res.json(orders);
    } catch (error) {
      return res.status(400).json({ error: 'Não foi possível listar os pedidos.' });
    }
  },

  async show(req, res) {
    try {
      const order = await Order.findByPk(req.params.id, {
        include: [
          { association: 'item' },
          { association: 'originWarehouse' },
          { association: 'destinationWarehouse' },
        ]
      });
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }
      return res.json(order);
    } catch (error) {
      return res.status(400).json({ error: 'Não foi possível encontrar o pedido.' });
    }
  },

  async store(req, res) {
    const { type, originWarehouseId, destinationWarehouseId, itemId, quantity, observation } = req.body;

    // Business Rule: Satellite-to-satellite requests must go through Central.
    if (type === 'Requisição') {
      const originIsSatellite = originWarehouseId && originWarehouseId !== 1;
      const destIsSatellite = destinationWarehouseId && destinationWarehouseId !== 1;
      if (originIsSatellite && destIsSatellite) {
        return res.status(400).json({ error: 'Requisições entre depósitos satélites devem ser direcionadas para a Central.' });
      }
    }


    try {
      const order = await Order.create({
        type,
        originWarehouseId,
        destinationWarehouseId,
        itemId,
        quantity,
        observation,
        status: 'Pendente',
      });
      return res.status(201).json(order);
    } catch (error) {
      return res.status(400).json({ error: 'Não foi possível criar o pedido.' });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }

      order.status = status ?? order.status;

      await order.save();

      return res.json(order);
    } catch (error) {
      return res.status(400).json({ error: 'Não foi possível atualizar o pedido.' });
    }
  },
};
