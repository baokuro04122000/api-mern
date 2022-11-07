const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  createComment,
} = require('../controllers/product');

const { requireSignin } = require('../controllers/auth')


router.get('/product', getAllProducts);
router.post('/product', requireSignin, createProduct);
router.put('/product/:productId',requireSignin, updateProduct);
router.delete('/product/:productId',requireSignin, deleteProduct);
router.get('/product/:productId', getProductById);
router.put('/comment/:productId', createComment)

module.exports = router;

