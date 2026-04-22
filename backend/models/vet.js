const mongoose = require('mongoose')
const { Schema } = mongoose

const VetSchema = new Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, default: 0 },
  distance: { type: String }, // This might be calculated dynamically
  isOpen: { type: Boolean, default: true },
  hours: { type: String, trim: true },
  services: [{ type: String }],
  image: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
}, { timestamps: true })

module.exports = mongoose.models.Vet || mongoose.model('Vet', VetSchema)