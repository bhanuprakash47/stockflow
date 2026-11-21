const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  organizationId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'Organizations',
      key: 'id',
    },
  },
  defaultLowStockThreshold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    validate: {
      isInt: { msg: 'Default low stock threshold must be an integer' },
      min: {
        args: [0],
        msg: 'Default low stock threshold cannot be negative',
      },
    },
  },
}, {
  timestamps: true,
  tableName: 'Settings',
});

module.exports = Setting;
