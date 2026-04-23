require('dotenv').config()
const mongoose = require('mongoose')
const Vet = require('./models/vet')

const indianVets = [
  // Mumbai Vets
  {
    name: 'Mumbai Pet Care Clinic',
    address: 'Bandra, Mumbai, Maharashtra',
    phone: '+91-22-5432-1098',
    rating: 4.8,
    reviewCount: 245,
    isOpen: true,
    hours: '9:00 AM - 9:00 PM',
    services: ['General Checkup', 'Vaccination', 'Surgery', 'Dental Care'],
    image: 'https://via.placeholder.com/200?text=Mumbai+Pet+Clinic',
    latitude: 19.0596,
    longitude: 72.8295,
  },
  {
    name: 'Pawsitive Care Mumbai',
    address: 'Andheri, Mumbai, Maharashtra',
    phone: '+91-22-6789-0123',
    rating: 4.7,
    reviewCount: 189,
    isOpen: true,
    hours: '8:00 AM - 10:00 PM',
    services: ['Emergency', 'Grooming', 'Consultation', 'Microchipping'],
    image: 'https://via.placeholder.com/200?text=Pawsitive+Care',
    latitude: 19.1136,
    longitude: 72.8697,
  },

  // Delhi Vets
  {
    name: 'Delhi Animal Hospital',
    address: 'Sector 18, Noida, Delhi NCR',
    phone: '+91-120-4567-8901',
    rating: 4.6,
    reviewCount: 312,
    isOpen: true,
    hours: '24/7',
    services: ['Emergency', 'ICU', 'Surgery', 'Radiology'],
    image: 'https://via.placeholder.com/200?text=Delhi+Animal+Hospital',
    latitude: 28.5740,
    longitude: 77.3569,
  },
  {
    name: 'Vet Connect Delhi',
    address: 'Karol Bagh, Delhi',
    phone: '+91-11-2345-6789',
    rating: 4.5,
    reviewCount: 156,
    isOpen: true,
    hours: '10:00 AM - 8:00 PM',
    services: ['Consultation', 'Vaccination', 'Ultrasound'],
    image: 'https://via.placeholder.com/200?text=Vet+Connect',
    latitude: 28.6431,
    longitude: 77.1831,
  },

  // Bangalore Vets
  {
    name: 'Bangalore Pet Hospital',
    address: 'Indiranagar, Bangalore, Karnataka',
    phone: '+91-80-1234-5678',
    rating: 4.9,
    reviewCount: 428,
    isOpen: true,
    hours: '9:00 AM - 9:00 PM',
    services: ['General Checkup', 'Surgery', 'Dental', 'Rehabilitation'],
    image: 'https://via.placeholder.com/200?text=Bangalore+Pet+Hospital',
    latitude: 12.9716,
    longitude: 77.6412,
  },
  {
    name: 'Paws & Tails Clinic',
    address: 'Whitefield, Bangalore, Karnataka',
    phone: '+91-80-9876-5432',
    rating: 4.7,
    reviewCount: 267,
    isOpen: true,
    hours: '8:30 AM - 8:30 PM',
    services: ['Grooming', 'Training', 'Boarding', 'Pet Shop'],
    image: 'https://via.placeholder.com/200?text=Paws+Tails',
    latitude: 12.9698,
    longitude: 77.7499,
  },

  // Pune Vets
  {
    name: 'Pune Veterinary Clinic',
    address: 'Koregaon Park, Pune, Maharashtra',
    phone: '+91-20-2567-8901',
    rating: 4.6,
    reviewCount: 198,
    isOpen: true,
    hours: '9:00 AM - 7:00 PM',
    services: ['Consultation', 'Vaccination', 'Microchipping'],
    image: 'https://via.placeholder.com/200?text=Pune+Vet+Clinic',
    latitude: 18.5204,
    longitude: 73.8567,
  },

  // Hyderabad Vets
  {
    name: 'Hyderabad Pet Care',
    address: 'Banjara Hills, Hyderabad, Telangana',
    phone: '+91-40-4321-9876',
    rating: 4.8,
    reviewCount: 334,
    isOpen: true,
    hours: '9:00 AM - 9:00 PM',
    services: ['Emergency', 'Surgery', 'Ultrasound', 'Lab Tests'],
    image: 'https://via.placeholder.com/200?text=Hyderabad+Pet+Care',
    latitude: 17.3850,
    longitude: 78.4867,
  },

  // Chennai Vets
  {
    name: 'Chennai Animal Hospital',
    address: 'Alwarpet, Chennai, Tamil Nadu',
    phone: '+91-44-2432-1098',
    rating: 4.7,
    reviewCount: 276,
    isOpen: true,
    hours: '8:00 AM - 8:00 PM',
    services: ['General Checkup', 'Vaccination', 'Surgery'],
    image: 'https://via.placeholder.com/200?text=Chennai+Animal+Hospital',
    latitude: 13.0033,
    longitude: 80.2670,
  },

  // Kolkata Vets
  {
    name: 'Kolkata Pet Clinic',
    address: 'Salt Lake City, Kolkata, West Bengal',
    phone: '+91-33-6123-4567',
    rating: 4.5,
    reviewCount: 167,
    isOpen: true,
    hours: '9:00 AM - 6:00 PM',
    services: ['Consultation', 'Vaccination', 'Dental Care'],
    image: 'https://via.placeholder.com/200?text=Kolkata+Pet+Clinic',
    latitude: 22.5726,
    longitude: 88.3639,
  },
]

const seedVets = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URI
    if (!mongoUrl) {
      console.error('❌ MONGODB_URI not found in .env')
      process.exit(1)
    }

    console.log('Connecting to MongoDB...')
    await mongoose.connect(mongoUrl)
    console.log('✅ Connected to MongoDB')

    // Delete existing vets
    const deletedCount = await Vet.deleteMany({})
    console.log(`🗑️  Deleted ${deletedCount.deletedCount} existing vets`)

    // Insert new vets
    const result = await Vet.insertMany(indianVets)
    console.log(`✅ Added ${result.length} Indian vets to database`)

    console.log('\n📍 Vets Added:')
    result.forEach((vet, index) => {
      console.log(`${index + 1}. ${vet.name} - ${vet.address}`)
      console.log(`   Coordinates: ${vet.latitude}, ${vet.longitude}`)
      console.log(`   Rating: ${vet.rating} ⭐ (${vet.reviewCount} reviews)`)
    })

    console.log('\n✅ Vet seeding complete!')
    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding vets:', error.message)
    process.exit(1)
  }
}

seedVets()
