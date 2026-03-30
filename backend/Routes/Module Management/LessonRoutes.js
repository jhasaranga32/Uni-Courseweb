const express = require('express');
const router = express.Router();
const upload=require('../../Middleware/Upload');
const {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
  uploadPdf,
  addLink,
  deleteResource,
} = require('../../Controller/Module Management/LessonsController');

router.get('/modules/:moduleId/lessons',              getLessons);
router.get('/lessons/:id',                            getLesson);
router.post('/modules/:moduleId/lessons',             createLesson);
router.put('/lessons/:id',                            updateLesson);
router.delete('/lessons/:id',                         deleteLesson);
router.post('/lessons/:id/upload-pdf', upload.single('pdf'), uploadPdf);
router.post('/lessons/:id/add-link',                  addLink);
router.delete('/lessons/:id/resources/:resourceId',   deleteResource);

module.exports = router;