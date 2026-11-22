const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { getDashboardOverview } = require('../controllers/dashboardController');

router.get('/', verifyToken, getDashboardOverview);
router.get('/overview', verifyToken, getDashboardOverview);

module.exports = router;
