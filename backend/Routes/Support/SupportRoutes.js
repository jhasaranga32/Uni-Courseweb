const router   = require('express').Router()
const upload   = require('../../Middleware/Upload')
const { getAllLecturers, getLecturerById, createLecturer, updateLecturer, deleteLecturer } = require('../../Controller/Support/SupportController')

router.route('/')
  .get(getAllLecturers)
  .post(upload.single('image'), createLecturer)

router.route('/:id')
  .get(getLecturerById)
  .put(upload.single('image'), updateLecturer)
  .delete(deleteLecturer)

module.exports = router