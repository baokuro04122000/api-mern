const express = require('express')
const router = express.Router();

const {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/category');

const { requireSignin } =require('../controllers/auth')

router.get('/category', getCategories);
router.post('/category',requireSignin, createCategory);
router.put('/category/:categoryId', requireSignin, updateCategory);
router.delete('/category/:categoryId',requireSignin, deleteCategory);
router.get('/category/:categoryId', getCategoryById);

module.exports = router;
