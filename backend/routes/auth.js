const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { verifyToken, requireRole } = require('../middleware/auth')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'please-change-this-secret'
const SALT_ROUNDS = 10

router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(400).json({ error: 'A user with that email already exists.' })
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      fullName: fullName?.trim() || '',
      role: role || 'user',
    })

    const token = jwt.sign({ sub: user._id.toString() }, JWT_SECRET, { expiresIn: '30d' })

    res.json({ user: { id: user._id.toString(), email: user.email, fullName: user.fullName, role: user.role }, token })
  } catch (error) {
    res.status(500).json({ error: 'Unable to create account.' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(400).json({ error: 'Invalid login credentials.' })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid login credentials.' })
    }

    const token = jwt.sign({ sub: user._id.toString() }, JWT_SECRET, { expiresIn: '30d' })
    // Include role so the frontend can do role-based redirects immediately after login
    res.json({ user: { id: user._id.toString(), email: user.email, fullName: user.fullName, role: user.role }, token })
  } catch (error) {
    res.status(500).json({ error: 'Unable to log in.' })
  }
})

router.get('/me', verifyToken, async (req, res) => {
  res.json({ user: req.user })
})

// List all users (admin only)
router.get('/users', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).lean()
    const formatted = users.map((u) => ({
      id: u._id.toString(),
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      isActive: true,
      createdAt: u.createdAt,
    }))
    res.json({ users: formatted })
  } catch (error) {
    res.status(500).json({ error: 'Unable to load users.' })
  }
})

// Update user role (admin only)
router.put('/users/:id/role', verifyToken, requireRole(['admin']), async (req, res) => {
  try {
    const { role } = req.body
    if (!['user', 'vet', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' })
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).lean()
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }
    res.json({ user: { id: user._id.toString(), email: user.email, fullName: user.fullName, role: user.role } })
  } catch (error) {
    res.status(500).json({ error: 'Unable to update user role.' })
  }
})

module.exports = router
