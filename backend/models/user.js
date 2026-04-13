const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, trim: true },
}, { timestamps: true })

module.exports = mongoose.models.User || mongoose.model('User', UserSchema)
