const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  organizationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Organizations',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Product name cannot be empty' },
    },
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'SKU cannot be empty' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  quantityOnHand: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: { msg: 'Quantity on hand must be an integer' },
      min: {
        args: [0],
        msg: 'Quantity on hand cannot be negative',
      },
    },
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      isDecimal: { msg: 'Cost price must be a valid number' },
      min: {
        args: [0],
        msg: 'Cost price cannot be negative',
      },
    },
  },
  sellingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      isDecimal: { msg: 'Selling price must be a valid number' },
      min: {
        args: [0],
        msg: 'Selling price cannot be negative',
      },
    },
  },
  lowStockThreshold: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 5,
    validate: {
      isInt: { msg: 'Low stock threshold must be an integer' },
      min: {
        args: [0],
        msg: 'Low stock threshold cannot be negative',
      },
    },
  },
}, {
  timestamps: true,
  tableName: 'Products',
  indexes: [
    {
      unique: true,
      fields: ['organizationId', 'sku'],
      name: 'products_org_sku_unique',
    },
  ],
});

module.exports = Product;
