const express = require('express');
const { Order } = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');

exports.createOrder = async (req, res) => {
  const data = new Order({
    _id: new mongoose.Types.ObjectId(),
    products: req.body.products,
    amount: req.body.amount,
    user: req.body.user,
    address: req.body.address,
    total: req.body.total,
    status: req.body.status,
    method: req.body.method,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  const dateFrom = req.query.dateFrom;
  const dateTo = req.query.dateTo;

  try {
    if (dateFrom && dateTo) {
      const data = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(dateFrom), $lt: new Date(dateTo) },
          },
        },
      ]);
      res.json(data);
    } else {
      const data = await Order.find().populate('user').exec();
      const dataToSave = _.map(data, (item) => {
         return _.omit(item.toJSON(),
         ['user.hashed_password', 'user.salt'])
      })
      res.json(dataToSave);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const data = await Order.findById(req.params.orderId).populate('user');
    const dataToSave = _.omit(data.toJSON(),
    ['user.hashed_password', 'user.salt'])
    res.json(dataToSave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  //try {
    //const id = req.params.orderId;
    //const updatedData = req.body;
    //const options = { new: true };

    //const result = await Order.findByIdAndUpdate(id, updatedData, options);

    //res.send(result);
  //} catch (error) {
    //res.status(500).json({ message: error.message });
  //}
  try{
  const order = await Order.findById(req.params.orderId)

    console.log('==order', order)

    order.products.forEach(async item => {
      //console.log('==item', item.product.toJSON())
      await updateStock(item.product, item.count)

    })

    order.status = req.body.status
    res.status(200).json(order)
  }catch (error) {
    res.status(500).json({ message: error.message })
  }
};

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    
    console.log('==prev', product)

    product.sold = product.sold + quantity;

    console.log('==product', product.sold)
   await product.save({ validateBeforeSave: false })
}

exports.deleteOrder = async (req, res) => {
  try {
    const id = req.params.orderId;
    const data = await Order.findByIdAndDelete(id);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getIncome = async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  console.log('==', previousMonth, lastMonth);

  try {
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: previousMonth } },
      },
      {
        $project: {
          month: { $month: '$createdAt' },
          sales: '$total',
          amount: '$amount',
        },
      },
      {
        $group: {
          _id: '$month',
          totalAvenue: { $sum: '$sales' },
          total: { $sum: '$amount' },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
};
