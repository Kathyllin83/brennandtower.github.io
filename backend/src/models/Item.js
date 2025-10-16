const { Model, DataTypes } = require('sequelize');

class Item extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      status: DataTypes.ENUM('Disponível', 'Crítico', 'Em Reparo'),
      imageUrl: DataTypes.STRING,
      code: DataTypes.STRING,
      value: DataTypes.DECIMAL(10, 2),
      supplier: DataTypes.STRING,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });
  }
}

module.exports = Item;
