const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  adjustStock,
  deleteProduct,
} = require('../controllers/productController');

router.post('/', verifyToken, createProduct);
router.post('/add-product', verifyToken, createProduct);
router.get('/', verifyToken, getProducts);
router.get('/:id', verifyToken, getProductById);
router.put('/:id', verifyToken, updateProduct);
router.patch('/:id/adjust-stock', verifyToken, adjustStock);
router.post('/:id/adjust-stock', verifyToken, adjustStock);
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;
