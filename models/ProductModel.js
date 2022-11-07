const mongoose = require("mongoose");
const { ObjectId  } = mongoose.Schema

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
      required: true,
    },
    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: [{
      user: {
        type: ObjectId,
        ref: 'User',
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
    }],
    supplier: {
      id: {
        type: ObjectId,
        ref: 'Organizer',
      },
      quantityImport: {
        type: Number,
      },
      price: {
        type: Number,
      }
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
