const { Sequelize } = require('sequelize');

if (!process.env.DATABASE_URL) {
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
}

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('DATABASE_URL is not set in environment variables.');
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL (Neon) Database connected successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to PostgreSQL database:', error.message);
    throw error;
  }
};

module.exports = { sequelize, connectDB };
