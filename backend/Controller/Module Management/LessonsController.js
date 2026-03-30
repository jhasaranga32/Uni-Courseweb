const fs = require('fs');
const Lesson = require('../../Model/Module Management/LessonModel');

// GET all lessons for a module
exports.getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ module: req.params.moduleId }).sort('order');
    res.json({ success: true, data: lessons });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// GET single lesson
exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: lesson });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// POST create lesson
exports.createLesson = async (req, res) => {
  try {
    const lesson = await Lesson.create({ ...req.body, module: req.params.moduleId });
    res.status(201).json({ success: true, data: lesson });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// PUT update lesson
exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lesson) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: lesson });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// DELETE lesson
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: 'Not found' });
    lesson.resources.forEach(r => {
      if (r.type === 'pdf') {
        const filePath = r.url.replace(`${process.env.BASE_URL}/`, '');
        fs.unlink(filePath, () => {});
      }
    });
    res.json({ success: true, message: 'Lesson deleted' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// POST upload PDF
exports.uploadPdf = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: 'Not found' });

    const url = `${process.env.BASE_URL}/uploads/lessons/${req.file.filename}`;
    const label = req.body.label || req.file.originalname;

    lesson.resources.push({ type: 'pdf', label, url });
    await lesson.save();
    res.json({ success: true, data: lesson });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// POST add link
exports.addLink = async (req, res) => {
  try {
    const { label, url } = req.body;
    if (!label || !url) return res.status(400).json({ success: false, message: 'Label and URL required' });

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: 'Not found' });

    lesson.resources.push({ type: 'link', label, url });
    await lesson.save();
    res.json({ success: true, data: lesson });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// DELETE single resource
exports.deleteResource = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: 'Not found' });

    const resource = lesson.resources.id(req.params.resourceId);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    if (resource.type === 'pdf') {
      const filePath = resource.url.replace(`${process.env.BASE_URL}/`, '');
      fs.unlink(filePath, () => {});
    }

    resource.deleteOne();
    await lesson.save();
    res.json({ success: true, data: lesson });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};