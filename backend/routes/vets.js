const express = require('express')
const Vet = require('../models/vet')
const { verifyToken, requireRole } = require('../middleware/auth')

const router = express.Router()

// Get all vets
router.get('/', async (req, res) => {
  try {
    const vets = await Vet.find({}).sort({ createdAt: -1 }).lean()
    res.json({ vets })
  } catch (error) {
    res.status(500).json({ error: 'Unable to load vets.' })
  }
})

// Get a specific vet
router.get('/:id', async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id).lean()
    if (!vet) {
      return res.status(404).json({ error: 'Vet not found.' })
    }
    res.json({ vet })
  } catch (error) {
    res.status(500).json({ error: 'Unable to load vet.' })
  }
})

// Create a new vet (admin only)
router.post('/', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      rating,
      reviewCount,
      distance,
      isOpen,
      hours,
      services,
      image,
      latitude,
      longitude
    } = req.body

    const vet = new Vet({
      name,
      address,
      phone,
      rating: Number(rating) || 0,
      reviewCount: Number(reviewCount) || 0,
      distance,
      isOpen: Boolean(isOpen),
      hours,
      services: Array.isArray(services) ? services : [],
      image,
      latitude: Number(latitude),
      longitude: Number(longitude)
    })

    await vet.save()
    res.status(201).json({ vet })
  } catch (error) {
    console.error('Error creating vet:', error)
    res.status(500).json({ error: 'Unable to create vet.' })
  }
})

// Update a vet (admin only)
router.put('/:id', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      rating,
      reviewCount,
      distance,
      isOpen,
      hours,
      services,
      image,
      latitude,
      longitude
    } = req.body

    const vet = await Vet.findByIdAndUpdate(
      req.params.id,
      {
        name,
        address,
        phone,
        rating: Number(rating),
        reviewCount: Number(reviewCount),
        distance,
        isOpen: Boolean(isOpen),
        hours,
        services: Array.isArray(services) ? services : [],
        image,
        latitude: Number(latitude),
        longitude: Number(longitude)
      },
      { new: true }
    )

    if (!vet) {
      return res.status(404).json({ error: 'Vet not found.' })
    }

    res.json({ vet })
  } catch (error) {
    console.error('Error updating vet:', error)
    res.status(500).json({ error: 'Unable to update vet.' })
  }
})

// Delete a vet (admin only)
router.delete('/:id', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const vet = await Vet.findByIdAndDelete(req.params.id)

    if (!vet) {
      return res.status(404).json({ error: 'Vet not found.' })
    }

    res.json({ message: 'Vet deleted successfully.' })
  } catch (error) {
    console.error('Error deleting vet:', error)
    res.status(500).json({ error: 'Unable to delete vet.' })
  }
})

module.exports = router