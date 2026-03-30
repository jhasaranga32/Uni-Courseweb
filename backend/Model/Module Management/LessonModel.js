const mongoose = require('mongoose')
const resourceSchema = new mongoose.Schema({
  type:  { type: String, enum: ['pdf', 'link'], required: true },
  label: { type: String, required: true },
  url:   { type: String, required: true },
})

const lessonSchema = new mongoose.Schema({
  module:    { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  title:     { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  order:     { type: Number, default: 0 },
  resources: [resourceSchema],
}, { timestamps: true })


module.exports = mongoose.model('Lesson', lessonSchema)