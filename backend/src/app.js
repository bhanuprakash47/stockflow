const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'StockFlow API is running',
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes mounted on both /api/auth and /auth
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

module.exports = app;
