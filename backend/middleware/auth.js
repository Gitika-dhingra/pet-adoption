const jwt = require('jsonwebtoken')
const User = require('../models/user')

const JWT_SECRET = process.env.JWT_SECRET || 'please-change-this-secret'

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' })
    }

    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.sub).lean()

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
    }

    next()
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}

module.exports = { verifyToken, requireRole }
