const mongoose = require('mongoose')
const { Schema } = mongoose

const AdoptionApplicationSchema = new Schema({
  petId: { type: String, required: true },
  userId: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  housingType: { type: String, required: true },
  hasYard: { type: Boolean, default: false },
  hasOtherPets: { type: Boolean, default: false },
  otherPetsDetails: { type: String, default: '' },
  experience: { type: String, default: '' },
  whyAdopt: { type: String, required: true },
  status: { type: String, default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.models.AdoptionApplication || mongoose.model('AdoptionApplication', AdoptionApplicationSchema)
