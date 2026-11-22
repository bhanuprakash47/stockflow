const { Op } = require('sequelize');
const { Product, Setting } = require('../models');

const createProduct = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user?.organizationId;
    if (!organizationId) {
      return res.status(401).json({ error: 'Organization context missing' });
    }

    const {
      name,
      sku,
      description,
      quantityOnHand,
      costPrice,
      sellingPrice,
      lowStockThreshold,
    } = req.body;

    if (!name || !sku) {
      return res.status(400).json({ error: 'Name and SKU are required fields' });
    }

    const cleanName = name.trim();
    const cleanSku = sku.trim();

    const existingProduct = await Product.findOne({
      where: {
        organizationId,
        sku: cleanSku,
      },
    });

    if (existingProduct) {
      return res.status(400).json({
        error: 'A product with this SKU already exists in your organization',
      });
    }

    let resolvedThreshold = 5;
    if (lowStockThreshold !== undefined && lowStockThreshold !== null && lowStockThreshold !== '') {
      resolvedThreshold = parseInt(lowStockThreshold, 10);
    } else {
      const setting = await Setting.findOne({ where: { organizationId } });
      if (setting && setting.defaultLowStockThreshold !== null) {
        resolvedThreshold = setting.defaultLowStockThreshold;
      }
    }

    const parsedQuantity = quantityOnHand !== undefined && quantityOnHand !== null && quantityOnHand !== ''
      ? parseInt(quantityOnHand, 10)
      : 0;

    const parsedCost = costPrice !== undefined && costPrice !== null && costPrice !== ''
      ? parseFloat(costPrice)
      : null;

    const parsedSelling = sellingPrice !== undefined && sellingPrice !== null && sellingPrice !== ''
      ? parseFloat(sellingPrice)
      : null;

    const product = await Product.create({
      organizationId,
      name: cleanName,
      sku: cleanSku,
      description: description ? description.trim() : null,
      quantityOnHand: parsedQuantity,
      costPrice: parsedCost,
      sellingPrice: parsedSelling,
      lowStockThreshold: resolvedThreshold,
    });

    const isLowStock = product.quantityOnHand <= (product.lowStockThreshold !== null ? product.lowStockThreshold : 5);

    return res.status(201).json({
      message: 'Product created successfully',
      product: {
        ...product.toJSON(),
        isLowStock,
      },
    });
  } catch (err) {
    console.error('Error in createProduct:', err.message);
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      const detailMessage = err.errors && err.errors.length > 0 ? err.errors.map(e => e.message).join(', ') : err.message;
      return res.status(400).json({
        error: detailMessage,
      });
    }
    return res.status(500).json({
      error: 'Failed to create product',
      details: err.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user?.organizationId;
    if (!organizationId) {
      return res.status(401).json({ error: 'Organization context missing' });
    }

    const searchQuery = req.query.search || req.query.q;
    const whereClause = { organizationId };

    if (searchQuery && searchQuery.trim() !== '') {
      const term = `%${searchQuery.trim()}%`;
      whereClause[Op.or] = [
        { name: { [Op.iLike]: term } },
        { sku: { [Op.iLike]: term } },
      ];
    }

    const products = await Product.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    const setting = await Setting.findOne({ where: { organizationId } });
    const defaultThreshold = setting ? setting.defaultLowStockThreshold : 5;

    const formattedProducts = products.map((item) => {
      const threshold = item.lowStockThreshold !== null && item.lowStockThreshold !== undefined
        ? item.lowStockThreshold
        : defaultThreshold;
      return {
        ...item.toJSON(),
        isLowStock: item.quantityOnHand <= threshold,
      };
    });

    return res.status(200).json({
      products: formattedProducts,
      total: formattedProducts.length,
    });
  } catch (err) {
    console.error('Error in getProducts:', err.message);
    return res.status(500).json({
      error: 'Failed to retrieve products',
      details: err.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user?.organizationId;
    const { id } = req.params;

    const product = await Product.findOne({
      where: {
        id,
        organizationId,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const setting = await Setting.findOne({ where: { organizationId } });
    const defaultThreshold = setting ? setting.defaultLowStockThreshold : 5;
    const threshold = product.lowStockThreshold !== null && product.lowStockThreshold !== undefined
      ? product.lowStockThreshold
      : defaultThreshold;

    return res.status(200).json({
      product: {
        ...product.toJSON(),
        isLowStock: product.quantityOnHand <= threshold,
      },
    });
  } catch (err) {
    console.error('Error in getProductById:', err.message);
    return res.status(500).json({
      error: 'Failed to retrieve product',
      details: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user?.organizationId;
    const { id } = req.params;

    const product = await Product.findOne({
      where: {
        id,
        organizationId,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const {
      name,
      sku,
      description,
      quantityOnHand,
      costPrice,
      sellingPrice,
      lowStockThreshold,
    } = req.body;

    if (sku && sku.trim() !== product.sku) {
      const existingSku = await Product.findOne({
        where: {
          organizationId,
          sku: sku.trim(),
          id: { [Op.ne]: id },
        },
      });

      if (existingSku) {
        return res.status(400).json({
          error: 'Another product with this SKU already exists in your organization',
        });
      }
      product.sku = sku.trim();
    }

    if (name !== undefined) {
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Product name cannot be empty' });
      }
      product.name = name.trim();
    }

    if (description !== undefined) {
      product.description = description ? description.trim() : null;
    }

    if (quantityOnHand !== undefined && quantityOnHand !== null && quantityOnHand !== '') {
      product.quantityOnHand = parseInt(quantityOnHand, 10);
    }

    if (costPrice !== undefined) {
      product.costPrice = costPrice !== null && costPrice !== '' ? parseFloat(costPrice) : null;
    }

    if (sellingPrice !== undefined) {
      product.sellingPrice = sellingPrice !== null && sellingPrice !== '' ? parseFloat(sellingPrice) : null;
    }

    if (lowStockThreshold !== undefined) {
      product.lowStockThreshold = lowStockThreshold !== null && lowStockThreshold !== ''
        ? parseInt(lowStockThreshold, 10)
        : null;
    }

    await product.save();

    const setting = await Setting.findOne({ where: { organizationId } });
    const defaultThreshold = setting ? setting.defaultLowStockThreshold : 5;
    const threshold = product.lowStockThreshold !== null && product.lowStockThreshold !== undefined
      ? product.lowStockThreshold
      : defaultThreshold;

    return res.status(200).json({
      message: 'Product updated successfully',
      product: {
        ...product.toJSON(),
        isLowStock: product.quantityOnHand <= threshold,
      },
    });
  } catch (err) {
    console.error('Error in updateProduct:', err.message);
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      const detailMessage = err.errors && err.errors.length > 0 ? err.errors.map(e => e.message).join(', ') : err.message;
      return res.status(400).json({
        error: detailMessage,
      });
    }
    return res.status(500).json({
      error: 'Failed to update product',
      details: err.message,
    });
  }
};

const adjustStock = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user?.organizationId;
    const { id } = req.params;
    const { adjustment } = req.body;

    const delta = adjustment !== undefined ? parseInt(adjustment, 10) : NaN;

    if (isNaN(delta)) {
      return res.status(400).json({ error: 'A valid adjustment quantity is required' });
    }

    const product = await Product.findOne({
      where: {
        id,
        organizationId,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const nextQuantity = product.quantityOnHand + delta;
    if (nextQuantity < 0) {
      return res.status(400).json({
        error: 'Stock quantity cannot fall below 0',
        currentQuantity: product.quantityOnHand,
      });
    }

    product.quantityOnHand = nextQuantity;
    await product.save();

    const setting = await Setting.findOne({ where: { organizationId } });
    const defaultThreshold = setting ? setting.defaultLowStockThreshold : 5;
    const threshold = product.lowStockThreshold !== null && product.lowStockThreshold !== undefined
      ? product.lowStockThreshold
      : defaultThreshold;

    return res.status(200).json({
      message: 'Stock adjusted successfully',
      product: {
        ...product.toJSON(),
        isLowStock: product.quantityOnHand <= threshold,
      },
    });
  } catch (err) {
    console.error('Error in adjustStock:', err.message);
    return res.status(500).json({
      error: 'Failed to adjust stock',
      details: err.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.user?.organizationId;
    const { id } = req.params;

    const product = await Product.findOne({
      where: {
        id,
        organizationId,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();

    return res.status(200).json({
      message: 'Product deleted successfully',
      deletedProductId: id,
    });
  } catch (err) {
    console.error('Error in deleteProduct:', err.message);
    return res.status(500).json({
      error: 'Failed to delete product',
      details: err.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  adjustStock,
  deleteProduct,
};
