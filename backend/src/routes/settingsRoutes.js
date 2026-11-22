const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { getSettings, updateSettings } = require('../controllers/settingsController');

router.get('/', verifyToken, getSettings);
router.put('/', verifyToken, updateSettings);

module.exports = router;
