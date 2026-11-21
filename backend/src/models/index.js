const { sequelize } = require('../config/db');
const Organization = require('./Organization');
const User = require('./User');

// Relationship: One Organization has many Users, each User belongs to an Organization
Organization.hasMany(User, {
  foreignKey: 'organizationId',
  as: 'users',
  onDelete: 'CASCADE',
});

User.belongsTo(Organization, {
  foreignKey: 'organizationId',
  as: 'organization',
});

module.exports = {
  sequelize,
  Organization,
  User,
};
