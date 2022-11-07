const express = require('express');
const User = require('../models/UserModel');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const mailer = require('../utils/mailer');

exports.getUsers = async (req, res) => {
  try {
    const data = await User.find();
    const user = _.map(data, (item) => {
      return _.omit(item.toJSON(), ['hashed_password', 'salt']);
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const data = await User.findById(req.params.userId);

    res.json(_.omit(data.toJSON(), ['hashed_password', 'salt']));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const updatedData = req.body;
    const options = { new: true };

    const result = await User.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletaUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const data = await User.findByIdAndDelete(id);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err || !user) {
      res.status(404).send({ message: 'User not found.' });
    } else {
      const randomPassword = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      console.log('New password: ', randomPassword);
      user.hashed_password = user.encryptPassword(randomPassword);
      //mailer.sendMail(
        //req.body.email,
        //'GreenFood',
        //`<p>Mật khẩu mới của bạn là: ${randomPassword}</p>`
      //);
      res.status(200).json(user.save());
    }
  });
};

exports.changePassword = async (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err || !user) {
      res.status(404).send({ message: 'User not found.' });
    } else {
      const newPassword = req.body.newPassword;
      console.log(newPassword);

      if (!user.authenticate(req.body.oldPassword)) {
        return res.status(401).json({
          error: "Password isn't correct",
        });
      }

      user.hashed_password = user.encryptPassword(newPassword);
      // mailer.sendMail(
      //   req.body.email,
      //   'GreenFood',
      //   `<p>Thay đổi mật khẩu thành công.</p>`
      // );
      res.status(200).json(user.save());
    }
  });
};
