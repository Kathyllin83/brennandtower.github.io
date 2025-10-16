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

    // Validate destination based on origin
    if (originWarehouseId !== 1) { // Origin is a satellite
        if (destinationWarehouseId !== 1) {
            return res.status(400).json({ error: 'Requisições de depósitos satélites devem ser direcionadas para a Central.' });
        }
    }


    try {
      const order = await Order.create({
        type,
        originWarehouseId,
        destinationWarehouseId: destinationWarehouseId || null,
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
