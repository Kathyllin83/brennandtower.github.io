const { Model, DataTypes } = require('sequelize');

class WarehouseWeight extends Model {
  static init(sequelize) {
    super.init({
      weight: DataTypes.INTEGER,
      warehouseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      }
    }, {
      sequelize,
      tableName: 'warehouse_weights',
    })
  }

  static associate(models) {
    this.belongsTo(models.Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });
  }
}

module.exports = WarehouseWeight;
