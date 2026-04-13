const mongoose = require('mongoose')
const { Schema } = mongoose

const PetSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  age_unit: { type: String, required: true },
  gender: { type: String, required: true },
  size: { type: String, required: true },
  image_url: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, required: true, default: 'available' },
  description: { type: String, required: true },
  is_vaccinated: { type: Boolean, default: false },
  is_neutered: { type: Boolean, default: false },
  is_housetrained: { type: Boolean, default: false },
  good_with_kids: { type: Boolean, default: false },
  good_with_dogs: { type: Boolean, default: false },
  good_with_cats: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.models.Pet || mongoose.model('Pet', PetSchema)
