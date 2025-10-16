const Item = require('../models/Item');
const { Op } = require('sequelize');

module.exports = {
  async index(req, res) {
    const { warehouseId } = req.query;

    let where = {};
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    try {
      const items = await Item.findAll({ 
        where,
        include: { association: 'warehouse' }
      });
      return res.json(items);
    } catch (error) {
      return res.status(400).json({ error: 'Não foi possível listar os itens.' });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    try {
      const item = await Item.findByPk(id, { include: { association: 'warehouse' } });
      if (!item) {
        return res.status(404).json({ error: 'Item não encontrado.' });
      }
      return res.json(item);
    } catch (error) {
      return res.status(400).json({ error: 'Não foi possível obter o item.' });
    }
  },

  async store(req, res) {
    const { name, quantity, status, warehouseId } = req.body;

    try {
      const item = await Item.create({ name, quantity, status, warehouseId });
      return res.status(201).json(item);
    } catch (error) {
      return res.status(400).json({ error: 'Não foi possível criar o item.' });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { quantity, status } = req.body;

    try {
      const item = await Item.findByPk(id);
      if (!item) {
        return res.status(404).json({ error: 'Item não encontrado.' });
      }

      item.name = req.body.name ?? item.name;
      item.quantity = req.body.quantity ?? item.quantity;
      item.status = req.body.status ?? item.status;
      item.warehouseId = req.body.warehouseId ?? item.warehouseId;
      item.imageUrl = req.body.imageUrl ?? item.imageUrl;
      item.code = req.body.code ?? item.code;
      item.value = req.body.value ?? item.value;
      item.supplier = req.body.supplier ?? item.supplier;

      await item.save();

      return res.json(item);
    } catch (error) {
      return res.status(400).json({ error: 'Não foi possível atualizar o item.' });
    }
  },

  async destroy(req, res) {
    const { id } = req.params;
    try {
      const item = await Item.findByPk(id);
      if (!item) {
        return res.status(404).json({ error: 'Item não encontrado.' });
      }
      await item.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: 'Não foi possível remover o item.' });
    }
  },

  async getLowStock(req, res) {
    try {
      const lowStockItems = await Item.findAll({
        where: {
          [Op.or]: [
            { status: 'Crítico' },
            { quantity: { [Op.lte]: 10 } }
          ]
        },
        include: 'warehouse'
      });
      return res.json(lowStockItems);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get low stock items.' });
    }
  },
};
