const path = require('path')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoutes = require('./routes/auth')
const petsRoutes = require('./routes/pets')
const vetsRoutes = require('./routes/vets')
const applicationsRoutes = require('./routes/applications')
const reportsRoutes = require('./routes/reports')
const dashboardRoutes = require('./routes/dashboard')
const seedDatabase = require('./seed')

// Load .env.local only in development (file may not exist on Render)
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(__dirname, '../.env.local')
  try {
    require('fs').accessSync(envPath)
    dotenv.config({ path: envPath })
  } catch {
    console.log('No .env.local found, using environment variables')
  }
} else {
  dotenv.config()
}

const app = express()
const PORT = process.env.BACKEND_PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pawfinder'
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'

// Allow requests from frontend (both localhost for dev and Render for production)
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:10000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:10000',
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS not allowed'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB')
    await seedDatabase()
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error)
  })

app.use('/api/auth', authRoutes)
app.use('/api/pets', petsRoutes)
app.use('/api/vets', vetsRoutes)
app.use('/api/adoption-applications', applicationsRoutes)
app.use('/api/injury-reports', reportsRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`)
})
