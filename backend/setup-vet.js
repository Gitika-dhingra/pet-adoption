require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/user')

const setupVet = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URI
    if (!mongoUrl) {
      console.error('❌ MONGODB_URI not found in .env')
      process.exit(1)
    }

    console.log('Connecting to MongoDB...')
    await mongoose.connect(mongoUrl)
    console.log('✅ Connected to MongoDB')

    const vetEmail = 'vet@pawfinder.com'
    const vetPassword = 'Vet@123456'

    const existingVet = await User.findOne({ email: vetEmail })
    if (existingVet) {
      console.log(`⚠️  Vet user already exists: ${vetEmail}`)
      if (existingVet.role === 'vet') {
        console.log('✅ User is already a vet')
      } else {
        console.log('Updating role to vet...')
        existingVet.role = 'vet'
        await existingVet.save()
        console.log('✅ Role updated to vet')
      }
    } else {
      const passwordHash = await bcrypt.hash(vetPassword, 10)
      await User.create({
        email: vetEmail,
        passwordHash,
        fullName: 'Vet User',
        role: 'vet',
        isActive: true,
      })
      console.log('✅ Vet user created successfully!')
      console.log(`   Email: ${vetEmail}`)
      console.log(`   Password: ${vetPassword}`)
      console.log('⚠️  IMPORTANT: Change this password after first login!')
    }

    const vets = await User.find({ role: 'vet' }).select('email fullName createdAt')
    console.log('\n📋 All Vet Users:')
    vets.forEach((vet, index) => {
      console.log(`   ${index + 1}. ${vet.email} (${vet.fullName})`)
    })

    console.log('\n✅ Setup complete!')
    console.log('📍 Vet Dashboard: http://localhost:3000/vet')

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error setting up vet:', error.message)
    process.exit(1)
  }
}

setupVet()

