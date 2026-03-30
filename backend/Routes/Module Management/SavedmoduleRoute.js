const router = require('express').Router()
const { protect } = require('../../Middleware/auth')
const { getSavedModules, saveModule, unsaveModule } = require('../../Controller/Module Management/SavedmoduleController')

// All routes require a logged-in student
router.use(protect)

router.route('/')
  .get(getSavedModules)   // GET  /api/saved-modules
  .post(saveModule)       // POST /api/saved-modules

router.delete('/:moduleId', unsaveModule) // DELETE /api/saved-modules/:moduleId

module.exports = router