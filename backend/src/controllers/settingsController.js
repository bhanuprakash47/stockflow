const { Setting } = require('../models');

const getSettings = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user?.organizationId;
    if (!organizationId) {
      return res.status(401).json({ error: 'Organization context missing' });
    }

    let setting = await Setting.findOne({ where: { organizationId } });
    if (!setting) {
      setting = await Setting.create({
        organizationId,
        defaultLowStockThreshold: 5,
      });
    }

    return res.status(200).json({ setting });
  } catch (err) {
    console.error('Error in getSettings:', err.message);
    return res.status(500).json({
      error: 'Failed to retrieve settings',
      details: err.message,
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user?.organizationId;
    if (!organizationId) {
      return res.status(401).json({ error: 'Organization context missing' });
    }

    const { defaultLowStockThreshold } = req.body;
    const parsedThreshold = parseInt(defaultLowStockThreshold, 10);

    if (isNaN(parsedThreshold) || parsedThreshold < 0) {
      return res.status(400).json({
        error: 'A valid non-negative integer is required for defaultLowStockThreshold',
      });
    }

    let setting = await Setting.findOne({ where: { organizationId } });
    if (!setting) {
      setting = await Setting.create({
        organizationId,
        defaultLowStockThreshold: parsedThreshold,
      });
    } else {
      setting.defaultLowStockThreshold = parsedThreshold;
      await setting.save();
    }

    return res.status(200).json({
      message: 'Settings updated successfully',
      setting,
    });
  } catch (err) {
    console.error('Error in updateSettings:', err.message);
    return res.status(500).json({
      error: 'Failed to update settings',
      details: err.message,
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
