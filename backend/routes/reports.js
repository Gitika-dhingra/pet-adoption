const express = require('express')
const jwt = require('jsonwebtoken')
const InjuryReport = require('../models/injuryReport')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'please-change-this-secret'

router.post('/', async (req, res) => {
  try {
    let userId = null
    const authHeader = req.headers.authorization || ''

    if (authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7)
        const payload = jwt.verify(token, JWT_SECRET)
        userId = payload.sub
      } catch {
        userId = null
      }
    }

    const {
      animalType,
      description,
      location,
      latitude,
      longitude,
      urgency,
      reporterName,
      reporterPhone,
      reporterEmail,
      imageUrl,
    } = req.body

    if (!animalType || !description || !location || !urgency || !reporterName || !reporterPhone || !reporterEmail) {
      return res.status(400).json({ error: 'Missing required report fields.' })
    }

    const report = await InjuryReport.create({
      userId,
      animalType,
      description,
      location,
      latitude: latitude || null,
      longitude: longitude || null,
      urgency,
      reporterName,
      reporterPhone,
      reporterEmail,
      imageUrl: imageUrl || '',
      status: 'pending',
    })

    res.json({ report })
  } catch (error) {
    res.status(500).json({ error: 'Unable to submit injury report.' })
  }
})

module.exports = router
