const { Product, Setting } = require('../models');

const getDashboardOverview = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user?.organizationId;
    if (!organizationId) {
      return res.status(401).json({ error: 'Organization context missing' });
    }

    const setting = await Setting.findOne({ where: { organizationId } });
    const defaultThreshold = setting && setting.defaultLowStockThreshold !== null
      ? setting.defaultLowStockThreshold
      : 5;

    const products = await Product.findAll({
      where: { organizationId },
      order: [['name', 'ASC']],
    });

    const totalProducts = products.length;

    let totalQuantityOnHand = 0;
    const lowStockItems = [];

    for (const item of products) {
      const qty = item.quantityOnHand || 0;
      totalQuantityOnHand += qty;

      const threshold = item.lowStockThreshold !== null && item.lowStockThreshold !== undefined
        ? item.lowStockThreshold
        : defaultThreshold;

      if (qty <= threshold) {
        lowStockItems.push({
          id: item.id,
          name: item.name,
          sku: item.sku,
          quantityOnHand: qty,
          lowStockThreshold: threshold,
          costPrice: item.costPrice,
          sellingPrice: item.sellingPrice,
        });
      }
    }

    return res.status(200).json({
      totalProducts,
      totalQuantityOnHand,
      lowStockCount: lowStockItems.length,
      lowStockItems,
    });
  } catch (err) {
    console.error('Error in getDashboardOverview:', err.message);
    return res.status(500).json({
      error: 'Failed to retrieve dashboard metrics',
      details: err.message,
    });
  }
};

module.exports = {
  getDashboardOverview,
};
