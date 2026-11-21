const { sequelize } = require('../config/db');
const Organization = require('./Organization');
const User = require('./User');
const Product = require('./Product');
const Setting = require('./Setting');

// Relationship: Organization & User
Organization.hasMany(User, {
  foreignKey: 'organizationId',
  as: 'users',
  onDelete: 'CASCADE',
});

User.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization',
});

// Relationship: Organization & Product
Organization.hasMany(Product, {
  foreignKey: 'organizationId',
  as: 'products',
  onDelete: 'CASCADE',
});

Product.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization',
});

// Relationship: Organization & Setting (One setting profile per organization)
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
