const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
}, 
  { timestamps: true}
);

module.exports = mongoose.model("Category", categorySchema);
