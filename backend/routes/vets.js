const express = require('express')
const Vet = require('../models/vet')
const { verifyToken, requireRole } = require('../middleware/auth')

const router = express.Router()

// Get nearby vets based on latitude/longitude (with radius in km)
router.get('/nearby/:latitude/:longitude', async (req, res) => {
  try {
    const { latitude, longitude } = req.params
    const radiusKm = req.query.radius || 50 // Default 50km radius
    const radiusRadians = radiusKm / 6371 // Convert km to radians (Earth radius = 6371 km)

    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude' })
    }

    // Use MongoDB geospatial query
    const vets = await Vet.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radiusKm * 1000 // Convert km to meters
        }
      }
    }).lean()

    // If geospatial index doesn't exist, fallback to manual distance calculation
    if (vets.length === 0) {
      const allVets = await Vet.find({ latitude: { $exists: true }, longitude: { $exists: true } }).lean()
      
      const nearbyVets = allVets
        .map(vet => {
          const R = 6371 // Earth's radius in km
          const dLat = (vet.latitude - lat) * Math.PI / 180
          const dLng = (vet.longitude - lng) * Math.PI / 180
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat * Math.PI / 180) * Math.cos(vet.latitude * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2)
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
          const distance = R * c
          
          return { ...vet, distance: distance.toFixed(2) }
        })
        .filter(vet => vet.distance <= radiusKm)
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))

      return res.json({ vets: nearbyVets })
    }

    res.json({ vets })
  } catch (error) {
    console.error('Error finding nearby vets:', error)
    res.status(500).json({ error: 'Unable to find nearby vets.' })
  }
})

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