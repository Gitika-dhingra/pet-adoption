const express = require('express')
const Pet = require('../models/pet')
const { verifyToken, requireRole } = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { species, size, gender, minAge, maxAge } = req.query
    let query = { status: 'available' }

    if (species && species !== 'all') query.species = species
    if (size) query.size = { $in: Array.isArray(size) ? size : size.toString().split(',').filter(Boolean) }
    if (gender) query.gender = { $in: Array.isArray(gender) ? gender : gender.toString().split(',').filter(Boolean) }
    if (minAge) query.age = { ...query.age, $gte: Number(minAge) }
    if (maxAge) query.age = { ...query.age, $lte: Number(maxAge) }

    const pets = await Pet.find(query).sort({ createdAt: -1 }).lean()
    res.json({ pets })
  } catch (error) {
    res.status(500).json({ error: 'Unable to load pets.' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findOne({ id: req.params.id }).lean()
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found.' })
    }
    res.json({ pet })
  } catch (error) {
    res.status(500).json({ error: 'Unable to load pet.' })
  }
})

// Create a new pet (admin/vet only)
router.post('/', verifyToken, requireRole(['admin', 'vet']), async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      age_unit,
      gender,
      size,
      image_url,
      location,
      description,
      is_vaccinated,
      is_neutered,
      is_housetrained,
      good_with_kids,
      good_with_dogs,
      good_with_cats,
      status
    } = req.body

    // Generate unique ID
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)

    const pet = new Pet({
      id,
      name,
      species,
      breed,
      age: Number(age),
      age_unit,
      gender,
      size,
      image_url,
      location,
      description,
      is_vaccinated: Boolean(is_vaccinated),
      is_neutered: Boolean(is_neutered),
      is_housetrained: Boolean(is_housetrained),
      good_with_kids: Boolean(good_with_kids),
      good_with_dogs: Boolean(good_with_dogs),
      good_with_cats: Boolean(good_with_cats),
      status: status || 'available'
    })

    await pet.save()
    res.status(201).json({ pet })
  } catch (error) {
    console.error('Error creating pet:', error)
    res.status(500).json({ error: 'Unable to create pet.' })
  }
})

// Update a pet (admin/vet only)
router.put('/:id', verifyToken, requireRole(['admin', 'vet']), async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      age_unit,
      gender,
      size,
      image_url,
      location,
      description,
      is_vaccinated,
      is_neutered,
      is_housetrained,
      good_with_kids,
      good_with_dogs,
      good_with_cats,
      status
    } = req.body

    const pet = await Pet.findOneAndUpdate(
      { id: req.params.id },
      {
        name,
        species,
        breed,
        age: Number(age),
        age_unit,
        gender,
        size,
        image_url,
        location,
        description,
        is_vaccinated: Boolean(is_vaccinated),
        is_neutered: Boolean(is_neutered),
        is_housetrained: Boolean(is_housetrained),
        good_with_kids: Boolean(good_with_kids),
        good_with_dogs: Boolean(good_with_dogs),
        good_with_cats: Boolean(good_with_cats),
        status
      },
      { new: true }
    )

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found.' })
    }

    res.json({ pet })
  } catch (error) {
    console.error('Error updating pet:', error)
    res.status(500).json({ error: 'Unable to update pet.' })
  }
})

// Delete a pet (admin only)
router.delete('/:id', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ id: req.params.id })

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found.' })
    }

    res.json({ message: 'Pet deleted successfully.' })
  } catch (error) {
    console.error('Error deleting pet:', error)
    res.status(500).json({ error: 'Unable to delete pet.' })
  }
})

// Get all pets for admin/vet management (includes all statuses)
router.get('/admin/all', verifyToken, requireRole(['admin', 'vet']), async (req, res) => {
  try {
    const pets = await Pet.find({}).sort({ createdAt: -1 }).lean()
    res.json({ pets })
  } catch (error) {
    res.status(500).json({ error: 'Unable to load pets.' })
  }
})

module.exports = router
