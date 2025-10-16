const { Model, DataTypes } = require('sequelize');

class Warehouse extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      location: DataTypes.STRING,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.hasMany(models.Item, { foreignKey: 'warehouseId', as: 'items' });
  }
}

module.exports = Warehouse;
