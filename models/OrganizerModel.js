const mongoose = require("mongoose")
const { ObjectId  } = mongoose.Schema

const organizerSchema = new  mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
  },
})

module.exports = mongoose.model("Organizer", organizerSchema)

