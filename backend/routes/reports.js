const express = require('express')
const jwt = require('jsonwebtoken')
const InjuryReport = require('../models/injuryReport')
const User = require('../models/user')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'please-change-this-secret'

// Middleware to check admin role
const checkAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const token = authHeader.slice(7)
    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.sub)
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Admin access required' })
    }
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

// Get all reports (admin only)
router.get('/admin/all', checkAdmin, async (req, res) => {
  try {
    const reports = await InjuryReport.find().sort({ createdAt: -1 }).populate('userId', 'email fullName')
    res.json({ reports })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' })
  }
})

// Update report status (admin only)
router.patch('/:id/status', checkAdmin, async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'in-progress', 'resolved', 'unable-to-help']
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const report = await InjuryReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    res.json({ report })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update report status' })
  }
})

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
