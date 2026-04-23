const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const Pet = require('./models/pet')

const indianPets = [
  {
    id: '101',
    name: 'Raja',
    species: 'dog',
    breed: 'Indian Pariah',
    age: 2,
    age_unit: 'years',
    gender: 'male',
    size: 'medium',
    image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=800&fit=crop',
    location: 'Mumbai, Maharashtra',
    status: 'available',
    description: 'Raja is a friendly and loyal Indian Pariah dog who loves to play and run. He is great with kids and perfect for an active family.',
    is_vaccinated: true,
    is_neutered: true,
    is_housetrained: true,
    good_with_kids: true,
    good_with_dogs: true,
    good_with_cats: false,
  },
  {
    id: '102',
    name: 'Priya',
    species: 'cat',
    breed: 'Indian Street Cat',
    age: 1,
    age_unit: 'years',
    gender: 'female',
    size: 'small',
    image_url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&h=800&fit=crop',
    location: 'Delhi, Delhi',
    status: 'available',
    description: 'Priya is a sweet and affectionate Indian cat who loves cuddles and sunny spots. She is independent and good with calm households.',
    is_vaccinated: true,
    is_neutered: true,
    is_housetrained: true,
    good_with_kids: true,
    good_with_dogs: false,
    good_with_cats: true,
  },
  {
    id: '103',
    name: 'Arjun',
    species: 'dog',
    breed: 'Indie Dog',
    age: 3,
    age_unit: 'years',
    gender: 'male',
    size: 'large',
    image_url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&h=800&fit=crop',
    location: 'Bangalore, Karnataka',
    status: 'available',
    description: 'Arjun is an intelligent and protective dog who is highly trainable. He loves learning new tricks and would excel in obedience training.',
    is_vaccinated: true,
    is_neutered: true,
    is_housetrained: true,
    good_with_kids: true,
    good_with_dogs: true,
    good_with_cats: false,
  },
  {
    id: '104',
    name: 'Mina',
    species: 'cat',
    breed: 'Bengal Mix',
    age: 6,
    age_unit: 'months',
    gender: 'female',
    size: 'small',
    image_url: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&h=800&fit=crop',
    location: 'Pune, Maharashtra',
    status: 'available',
    description: 'Mina is an energetic Bengal mix kitten who is always ready for adventure and playtime. Perfect for an active household.',
    is_vaccinated: true,
    is_neutered: false,
    is_housetrained: true,
    good_with_kids: true,
    good_with_dogs: true,
    good_with_cats: true,
  },
  {
    id: '105',
    name: 'Simran',
    species: 'dog',
    breed: 'Indie Mix',
    age: 4,
    age_unit: 'years',
    gender: 'female',
    size: 'medium',
    image_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
    location: 'Hyderabad, Telangana',
    status: 'available',
    description: 'Simran is a sweet and gentle dog who loves being by your side. She is patient with children and enjoys long walks.',
    is_vaccinated: true,
    is_neutered: true,
    is_housetrained: true,
    good_with_kids: true,
    good_with_dogs: true,
    good_with_cats: false,
  },
  {
    id: '106',
    name: 'Karan',
    species: 'dog',
    breed: 'Labrador Mix',
    age: 2,
    age_unit: 'years',
    gender: 'male',
    size: 'large',
    image_url: 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=400&h=400&fit=crop',
    location: 'Chennai, Tamil Nadu',
    status: 'available',
    description: 'Karan is a playful and energetic Labrador mix who loves to fetch and swim. Great for active families.',
    is_vaccinated: true,
    is_neutered: true,
    is_housetrained: true,
    good_with_kids: true,
    good_with_dogs: true,
    good_with_cats: false,
  },
]

async function addPets() {
  try {
    const mongoUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pawfinder'
    await mongoose.connect(mongoUrl)
    console.log('Connected to MongoDB')

    // Delete existing Indian pets to avoid duplicates
    await Pet.deleteMany({ id: { $in: indianPets.map(p => p.id) } })
    console.log('Cleared existing Indian pets')

    // Add new Indian pets
    const result = await Pet.insertMany(indianPets)
    console.log(`✅ Successfully added ${result.length} Indian pets to database`)

    indianPets.forEach(pet => {
      console.log(`   - ${pet.name} (${pet.species}) - ${pet.location}`)
    })

    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  } catch (error) {
    console.error('Error adding pets:', error)
    process.exit(1)
  }
}

addPets()
