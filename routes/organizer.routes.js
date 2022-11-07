const express = require('express')
const router = express.Router()

const {
  createOrganinzer,
  getOrganizers,
  getOrganizerById,
  updateOrganizer,
  deleteOrganizer,
} = require('../controllers/organizer')

const { requireSignin } = require('../controllers/auth')

router.get('/organizer', getOrganizers)
router.post('/organizer', requireSignin, createOrganinzer)
router.put('/organizer/:organizerId', requireSignin,updateOrganizer)
router.delete('/organizer/:organizerId', requireSignin, deleteOrganizer)
router.get('/organizer/:organizerId', getOrganizerById)

module.exports = router
