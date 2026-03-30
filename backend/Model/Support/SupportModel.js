const mongoose = require('mongoose')

const lecturerSchema = new mongoose.Schema({
  name:  { type: String, required: [true, 'Lecturer name is required'], trim: true },
  email: { type: String, required: [true, 'Lecturer email is required'], trim: true, unique: true, lowercase: true },
  image: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Lecturer', lecturerSchema)