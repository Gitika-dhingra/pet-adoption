const mongoose = require('mongoose')
const { Schema } = mongoose

const InjuryReportSchema = new Schema({
  userId: { type: String },
  animalType: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  urgency: { type: String, required: true },
  reporterName: { type: String, required: true },
  reporterPhone: { type: String, required: true },
  reporterEmail: { type: String, required: true },
  imageUrl: { type: String },
  status: { type: String, default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.models.InjuryReport || mongoose.model('InjuryReport', InjuryReportSchema)
