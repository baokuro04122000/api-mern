const express = require('express');
const router = express.Router();

const {
  getOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getIncome,
  filterOrder,
} = require('../controllers/order');

const { requireSignin } = require('../controllers/auth')

router.get('/order', getOrders);
router.post('/order', requireSignin, createOrder);
router.put('/order/:orderId', requireSignin, updateOrder);
router.delete('/order/:orderId', requireSignin, deleteOrder);
router.get('/order/:orderId', getOrderById);

router.get('/income', getIncome)

module.exports = router;

