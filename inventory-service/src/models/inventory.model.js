const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Inventory = sequelize.define('Inventory', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }
});

module.exports = Inventory;
