const { Model, DataTypes } = require('sequelize');

class Order extends Model {
  static init(sequelize) {
    super.init({
      type: DataTypes.ENUM('Requisição', 'Reparo'),
      quantity: DataTypes.INTEGER,
      status: DataTypes.ENUM('Aberto', 'Em Andamento', 'Entregue', 'Encerrado'),
      observation: DataTypes.TEXT,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.Warehouse, { foreignKey: 'originWarehouseId', as: 'originWarehouse' });
    this.belongsTo(models.Warehouse, { foreignKey: 'destinationWarehouseId', as: 'destinationWarehouse' });
    this.belongsTo(models.Item, { foreignKey: 'itemId', as: 'item' });
  }
}

module.exports = Order;
