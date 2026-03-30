const SavedModule = require('../../Model/Module Management/SavedmoduleModel')

// GET /api/saved-modules  — get all saved modules for the logged-in user
const getSavedModules = async (req, res) => {
  try {
    const saved = await SavedModule.find({ user: req.user._id })
      .populate({
        path: 'module',
        populate: [
          { path: 'faculty',  select: 'name code' },
          { path: 'semester', select: 'year semester' },
        ],
      })
      .sort({ savedAt: -1 })

    const data = saved.map(s => ({
      ...s.module.toObject(),
      savedAt:    s.savedAt,
      savedDocId: s._id,          // useful if you ever want to delete by this id
      facultyId:  s.module.faculty?._id,
      semesterId: s.module.semester?._id,
    }))

    res.json({ success: true, count: data.length, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// POST /api/saved-modules  — save a module  { moduleId }
const saveModule = async (req, res) => {
  try {
    const { moduleId } = req.body
    if (!moduleId) return res.status(400).json({ success: false, message: 'moduleId is required' })

    const saved = await SavedModule.create({ user: req.user._id, module: moduleId })
    res.status(201).json({ success: true, data: saved })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Module already saved' })
    }
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE /api/saved-modules/:moduleId  — unsave a module
const unsaveModule = async (req, res) => {
  try {
    const deleted = await SavedModule.findOneAndDelete({
      user:   req.user._id,
      module: req.params.moduleId,
    })
    if (!deleted) return res.status(404).json({ success: false, message: 'Saved module not found' })
    res.json({ success: true, message: 'Module removed from saved' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getSavedModules, saveModule, unsaveModule }