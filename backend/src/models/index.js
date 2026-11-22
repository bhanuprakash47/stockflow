const { sequelize } = require('../config/db');
const Organization = require('./Organization');
const User = require('./User');
const Product = require('./Product');
const Setting = require('./Setting');

Organization.hasMany(User, {
  foreignKey: 'organizationId',
  as: 'users',
  onDelete: 'CASCADE',
});

User.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization',
});

Organization.hasMany(Product, {
  foreignKey: 'organizationId',
  as: 'products',
  onDelete: 'CASCADE',
});

Product.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization',
});

Organization.hasOne(Setting, {
  foreignKey: 'organizationId',
  as: 'settings',
  onDelete: 'CASCADE',
});

Setting.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization',
});

module.exports = {
  sequelize,
  Organization,
  User,
  Product,
  Setting,
};
