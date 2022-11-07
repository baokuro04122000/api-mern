const express = require('express')
const router = express.Router()

const {
  createPayment,
  paymentSuccess,
  paymentCancel,
} = require('../controllers/payment')

router.post('/pay', createPayment)
router.get('/success', paymentSuccess)
router.get('/cancel', paymentCancel)

module.exports = router
