const Pet = require('./models/pet')
const User = require('./models/user')
const Vet = require('./models/vet')
const bcrypt = require('bcrypt')

const samplePets = [
  {
    id: '1',
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 2,
    age_unit: 'years',
    gender: 'male',
    size: 'large',
    image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=800&fit=crop',
    location: 'San Francisco, CA',
    status: 'available',
    description: 'Meet Buddy, a friendly and playful Golden Retriever who loves everyone he meets! Buddy enjoys long walks in the park, playing fetch, and cuddling on the couch. He is great with kids and other dogs, making him the perfect family companion. Buddy is fully trained, knows basic commands, and is always eager to please. He would thrive in an active household that can give him plenty of exercise and love.',
    is_vaccinated: true,
    is_neutered: true,
    is_housetrained: true,
    good_with_kids: true,
    good_with_dogs: true,
    good_with_cats: false,
  },
  {
    id: '2',
    name: 'Luna',
    species: 'cat',
    breed: 'British Shorthair',
    age: 1,
    age_unit: 'years',
    gender: 'female',
    size: 'medium',
    image_url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&h=800&fit=crop',
    location: 'Los Angeles, CA',
    status: 'available',
    description: 'Luna is a beautiful British Shorthair with the most mesmerizing eyes. She is calm, affectionate, and loves to be pampered. Luna enjoys lounging in sunny spots and will purr contentedly when you pet her. She is independent enough to entertain herself but also loves quality time with her humans. Luna would do well in a quiet home where she can be the queen of the castle.',
    is_vaccinated: true,
    is_neutered: true,
    is_housetrained: true,
    good_with_kids: true,
    good_with_dogs: false,
    good_with_cats: true,
  },
  {
    id: '3',
    name: 'Max',
    species: 'dog',
    breed: 'German Shepherd',
    age: 3,
    age_unit: 'years',
    gender: 'male',
    size: 'large',
    image_url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&h=800&fit=crop',
    location: 'Seattle, WA',
    status: 'available',
    description: 'Max is a loyal and intelligent German Shepherd looking for his forever home. He is highly trainable and loves to learn new tricks. Max is protective of his family while being gentle and affectionate with those he trusts. He needs an experienced owner who can provide consistent training and plenty of mental stimulation. Max would excel in activities like agility or obedience training.',
    is_vaccinated: true,
    is_neutered: true,
    is_housetrained: true,
    good_with_kids: true,
    good_with_dogs: true,
    good_with_cats: false,
  },
  {
    id: '4',
    name: 'Milo',
    species: 'cat',
    breed: 'Tabby',
    age: 6,
    age_unit: 'months',
    gender: 'male',
    size: 'small',
    image_url: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&h=800&fit=crop',
    location: 'Austin, TX',
    status: 'available',
    description: 'Milo is an energetic and curious tabby kitten who is always ready for adventure. He loves to play with toys, chase laser pointers, and explore every corner of the house. Milo would be perfect for an active household that can keep up with his playful personality.',
    is_vaccinated: true,
    is_neutered: false,
    is_housetrained: true,
    good_with_kids: true,
    good_with_dogs: true,
    good_with_cats: true,
  },
  {
    id: '5',
    name: 'Bella',
    species: 'dog',
    breed: 'Labrador Mix',
    age: 4,
    age_unit: 'years',
    gender: 'female',
    size: 'medium',
    image_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
    location: 'Denver, CO',
    status: 'available',
    description: 'Bella is a sweet and gentle Labrador mix who loves nothing more than being by your side. She enjoys hiking, swimming, and playing in the backyard. Bella is patient and wonderful with children of all ages.',
    is_vaccinated: true,
    is_neutered: true,
    is_housetrained: true,
    good_with_kids: true,
    good_with_dogs: true,
    good_with_cats: false,
  },
]

const sampleVets = [
  {
    name: "Happy Paws Veterinary Clinic",
    address: "123 Main Street, San Francisco, CA 94102",
    phone: "(415) 555-0123",
    rating: 4.8,
    reviewCount: 245,
    distance: "0.5 mi",
    isOpen: true,
    hours: "Open until 8:00 PM",
    services: ["Emergency Care", "Surgery", "Dental", "Vaccinations"],
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop",
  },
  {
    name: "City Pet Hospital",
    address: "456 Oak Avenue, San Francisco, CA 94103",
    phone: "(415) 555-0456",
    rating: 4.6,
    reviewCount: 189,
    distance: "1.2 mi",
    isOpen: true,
    hours: "Open until 6:00 PM",
    services: ["General Care", "X-Ray", "Lab Tests", "Grooming"],
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=300&fit=crop",
  },
  {
    name: "24/7 Emergency Animal Hospital",
    address: "789 Market Street, San Francisco, CA 94104",
    phone: "(415) 555-0789",
    rating: 4.9,
    reviewCount: 312,
    distance: "1.8 mi",
    isOpen: true,
    hours: "Open 24 hours",
    services: ["24/7 Emergency", "ICU", "Surgery", "Specialists"],
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&h=300&fit=crop",
  },
  {
    name: "Furry Friends Vet Care",
    address: "321 Valencia Street, San Francisco, CA 94110",
    phone: "(415) 555-0321",
    rating: 4.5,
    reviewCount: 156,
    distance: "2.3 mi",
    isOpen: false,
    hours: "Opens at 9:00 AM",
    services: ["Wellness Exams", "Vaccinations", "Microchipping", "Nutrition"],
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=300&fit=crop",
  },
  {
    name: "Bay Area Animal Clinic",
    address: "555 Mission Street, San Francisco, CA 94105",
    phone: "(415) 555-0555",
    rating: 4.7,
    reviewCount: 201,
    distance: "2.8 mi",
    isOpen: true,
    hours: "Open until 7:00 PM",
    services: ["Surgery", "Dentistry", "Dermatology", "Cardiology"],
    image: "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=400&h=300&fit=crop",
  },
]

const sampleUsers = [
  {
    email: 'admin@pawfinder.com',
    password: 'admin123',
    fullName: 'Admin User',
    role: 'admin',
  },
  {
    email: 'vet@pawfinder.com',
    password: 'vet123',
    fullName: 'Dr. Sarah Johnson',
    role: 'vet',
  },
  {
    email: 'vet2@pawfinder.com',
    password: 'vet123',
    fullName: 'Dr. Michael Chen',
    role: 'vet',
  },
]

module.exports = async function seedDatabase() {
  // Seed pets
  const petCount = await Pet.countDocuments()
  if (petCount === 0) {
    await Pet.create(samplePets)
    console.log('Seeded pet collection with', samplePets.length, 'pets')
  }

  // Seed vets
  const vetCount = await Vet.countDocuments()
  if (vetCount === 0) {
    await Vet.create(sampleVets)
    console.log('Seeded vet collection with', sampleVets.length, 'vets')
  }

  // Seed users
  const userCount = await User.countDocuments()
  if (userCount === 0) {
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        passwordHash: await bcrypt.hash(user.password, 10),
      }))
    )
    await User.create(hashedUsers)
    console.log('Seeded user collection with', sampleUsers.length, 'users')
    console.log('Admin login: admin@pawfinder.com / admin123')
    console.log('Vet login: vet@pawfinder.com / vet123')
  }
}
