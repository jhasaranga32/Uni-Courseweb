const express = require('express')
const {
  getStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAdmins,
  promoteToAdmin,
  demoteAdmin,
  createAdmin,
  createEmployee,

} = require('../../Controller/User Management/SuperAdminController.js')

const { requireSuperAdmin } = require('../../Middleware/auth.js')  // adjust path to match yours

const router = express.Router()

// All routes below are protected — SuperAdmin only
router.use(requireSuperAdmin)

// Dashboard stats
router.get('/stats', getStats)

// All users
router.get('/users',     getAllUsers)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

// Admin management
router.get('/admins',        getAdmins)
router.post('/admins',       createAdmin)
router.put('/promote/:id',   promoteToAdmin)
router.put('/demote/:id',    demoteAdmin)
router.post('/employees',    createEmployee)

module.exports = router
