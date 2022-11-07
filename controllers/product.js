const express = require('express');
const Product = require('../models/ProductModel');
const router = express.Router();
const mongoose = require('mongoose');
const _ =  require('lodash')

exports.createProduct = async (req, res) => {
  const data = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    category: req.body.category,
    quantity: req.body.quantity,
    price: req.body.price,
    description: req.body.description,
    photo: req.body.photo,
    sold: req.body.sold,
    supplier: req.body.supplier,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  const name = req.query.search;
  try {
    if (name) {
      const data = await Product.find({
        name: new RegExp(name, 'i'),
      });
      res.json(data);
    } else {
      const data = await Product.find().populate('category')
            .populate({
               path: 'reviews',
               populate: {
                 path: 'user',
                 model: 'User',
               }
            }).populate({
               path: 'supplier',
              populate: {
                path: 'id',
                model: 'Organizer',
              }
            })
      const dataToSave = _.map(data, (item) => {
        return _.omit(item.toJSON(), 
      ['reviews.user.hashed_password', 'reviews.user.salt'])
      })
      res.json(dataToSave);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const data = await Product.findById(req.params.productId).populate('category')
            .populate({
               path: 'reviews',
               populate: {
                 path: 'user',
                 model: 'User',
               }
            }).populate({
               path: 'supplier',
               populate: {
                path: 'id',
                model: 'Organizer',
              }
            });
    const dataToSave = _.omit(data.toJSON(), 
      ['reviews.user.hashed_password', 'reviews.user.salt'])
    res.json(dataToSave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Product.findByIdAndUpdate(
      id,
      updatedData,
      options
    ).populate('category')
            .populate({
               path: 'reviews',
               populate: {
                 path: 'user',
                 model: 'User',
               }
            });
    const dataToSave = _.omit(result.toJSON(), 
  ['reviews.user.hashed_password', 'reviews.user.salt'])

    res.send(dataToSave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    const data = await Product.findByIdAndDelete(id);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { rating, comment, user } = req.body

    const review = {
      rating,
      comment, 
      user
    }

    const product = await Product.findById(req.params.productId)

    const findUserReview = product.reviews.find(item =>
        item.user.toString()===req.body.user
    )

    const isReviewed = findUserReview ? true : false

    if(isReviewed){
      product.reviews.forEach(review => {
        if(review.user.toString() === req.body.user){
          review.rating = rating,
            review.comment = comment
        }
      })
    }else{
    product.reviews.push(review)
    }

    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0)/product.reviews.length

    await product.save()
    res.status(200).json({ success: true })

  }catch(error){
    res.status(500).json({ message: error.message })
  }
}














