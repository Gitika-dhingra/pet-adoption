const express = require('express')
const Pet = require('../models/pet')

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

module.exports = router
