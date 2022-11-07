const User = require('../models/UserModel');
const jwt = require('jsonwebtoken'); 
const expressJwt = require('express-jwt'); 
const mailer = require('../utils/mailer');
const passport = require('passport');

require('dotenv').config();

exports.signup = (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    //mailer.sendMail(req.body.email,'GreenFood','<p>Chúc mừng bạn đã đăng ký tài khoản thành công.</p>')
    res.json({
      user,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email doesn't exist. Please signup.",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password didn't match",
      });
    }
    const token = jwt.sign(
      { _id: user._id },
      process.env.SECRET
    );
    res.cookie('t', token, { expire: new Date() + 9999 });
    return res.json({ token, user });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  res.json({ message: 'Signout success' });
};

exports.requireSignin = expressJwt({
  secret: process.env.SECRET,
  userProperty: 'auth',
});
