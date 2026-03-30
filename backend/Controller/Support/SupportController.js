const Lecturer = require('../../Model/Support/SupportModel')
const path = require('path')
const fs   = require('fs')

// GET /api/lecturers
const getAllLecturers = async (req, res) => {
  try {
    const lecturers = await Lecturer.find().sort({ createdAt: -1 })
    res.json({ success: true, count: lecturers.length, data: lecturers })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/lecturers/:id
const getLecturerById = async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.id)
    if (!lecturer) return res.status(404).json({ success: false, message: 'Lecturer not found' })
    res.json({ success: true, data: lecturer })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/lecturers
const createLecturer = async (req, res) => {
  try {
    const { name, email } = req.body
    const image = req.file ? `/uploads/lecturers/${req.file.filename}` : ''
    const lecturer = await Lecturer.create({ name, email, image })
    res.status(201).json({ success: true, data: lecturer })
  } catch (err) {
    const msg = err.code === 11000 ? 'Email already exists' : err.message
    res.status(400).json({ success: false, message: msg })
  }
}

// PUT /api/lecturers/:id
const updateLecturer = async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.id)
    if (!lecturer) return res.status(404).json({ success: false, message: 'Lecturer not found' })

    const { name, email } = req.body

    // If new image uploaded, delete old one
    if (req.file) {
      if (lecturer.image) {
        const oldPath = path.join(__dirname, '../../', lecturer.image)
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
      }
      lecturer.image = `/uploads/lecturers/${req.file.filename}`
    }

    lecturer.name  = name  || lecturer.name
    lecturer.email = email || lecturer.email
    await lecturer.save()

    res.json({ success: true, data: lecturer })
  } catch (err) {
    const msg = err.code === 11000 ? 'Email already exists' : err.message
    res.status(400).json({ success: false, message: msg })
  }
}

// DELETE /api/lecturers/:id
const deleteLecturer = async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.id)
    if (!lecturer) return res.status(404).json({ success: false, message: 'Lecturer not found' })

    // Delete image file if exists
    if (lecturer.image) {
      const imgPath = path.join(__dirname, '../../', lecturer.image)
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath)
    }

    await Lecturer.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Lecturer deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getAllLecturers, getLecturerById, createLecturer, updateLecturer, deleteLecturer }