require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/user')

const setupAdmin = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URI
    if (!mongoUrl) {
      console.error('❌ MONGODB_URI not found in .env')
      process.exit(1)
    }

    console.log('Connecting to MongoDB...')
    await mongoose.connect(mongoUrl)
    console.log('✅ Connected to MongoDB')

    // Admin credentials
    const adminEmail = 'admin@pawfinder.com'
    const adminPassword = 'Admin@123456' // Change this to a secure password!

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail })
    if (existingAdmin) {
      console.log(`⚠️  Admin user already exists: ${adminEmail}`)
      if (existingAdmin.role === 'admin') {
        console.log('✅ User is already an admin')
      } else {
        console.log('Updating role to admin...')
        existingAdmin.role = 'admin'
        await existingAdmin.save()
        console.log('✅ Role updated to admin')
      }
    } else {
      // Create new admin user
      const passwordHash = await bcrypt.hash(adminPassword, 10)
      const adminUser = await User.create({
        email: adminEmail,
        passwordHash,
        fullName: 'Admin User',
        role: 'admin',
        isActive: true,
      })
      console.log('✅ Admin user created successfully!')
      console.log(`   Email: ${adminEmail}`)
      console.log(`   Password: ${adminPassword}`)
      console.log('⚠️  IMPORTANT: Change this password after first login!')
    }

    // List all admins
    const admins = await User.find({ role: 'admin' }).select('email fullName createdAt')
    console.log('\n📋 All Admin Users:')
    admins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.email} (${admin.fullName})`)
    })

    console.log('\n✅ Setup complete!')
    console.log('📍 Admin Dashboard: http://localhost:3000/admin')

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message)
    process.exit(1)
  }
}

setupAdmin()
