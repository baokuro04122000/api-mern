const Organizer = require('../models/OrganizerModel')
const mongoose = require('mongoose')

exports.createOrganinzer = async (req, res) => {
  const data = new Organizer({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    quantityImport: req.body.quantityImport,
    price: req.body.price
  })

  try {
    const dataToSave = await data.save()
    res.status(200).json(dataToSave)
  }catch(error) {
    res.status(400).json({message: error.message })
  }
}

exports.getOrganizers = async (req, res) => {
  try {
    const data = await Organizer.find()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrganizerById = async (req, res) => {
  try{
    const data = await Organizer.findById(req.params.organizerId)
    res.status(200).json(data)
  }catch(error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateOrganizer = async (req, res) => {
  try {
    const id = req.params.organizerId
    const updateData = req.body
    const options = { new: true }

    const result = await Organizer.findByIdAndUpdate(id, updateData, options)

    res.status(200).json(result)
  }catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteOrganizer = async (req, res) => {
  try {
    const id = req.params.organizerId;
    const data = await Organizer.findByIdAndDelete(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
