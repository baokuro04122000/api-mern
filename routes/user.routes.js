const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const {
  getUsers,
  updateUser,
  deletaUser,
  getUserById,
  forgotPassword,
  changePassword,
} = require('../controllers/user');

const { requireSignin } = require('../controllers/auth');

router.get('/user', getUsers);
router.put('/user/:userId', requireSignin, updateUser);
router.delete('/user/:userId', requireSignin, deletaUser);
router.get('/user/:userId', getUserById);

router.post('/forgot-password', forgotPassword);
router.post('/change-password', changePassword);

module.exports = router;
