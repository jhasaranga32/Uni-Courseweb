const User    = require('../../Model/User Management/UserModel.js')
const Faculty = require('../../Model/Module Management/FacultyModel.js')   // adjust path if different

// ─────────────────────────────────────────────────────────────
// DASHBOARD STATS
// @route  GET /api/superadmin/stats
// ─────────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, students, admins, employees, faculties] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'Student' }),
      User.countDocuments({ role: 'Admin' }),
      User.countDocuments({ role: 'Employee' }),
      Faculty.countDocuments(),
    ])

    // Users registered per month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)

    const recentUsers = await User.find({ createdAt: { $gte: sixMonthsAgo } })
      .select('createdAt role')

    const monthMap = {}
    recentUsers.forEach(u => {
      const key = new Date(u.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' })
      monthMap[key] = (monthMap[key] || 0) + 1
    })
    const userGrowth = Object.entries(monthMap).map(([month, count]) => ({ month, count }))

    // Role distribution
    const roleData = [
      { name: 'Students',   value: students },
      { name: 'Employees',  value: employees },
      { name: 'Admins',     value: admins },
    ]

    res.json({ totalUsers, students, admins, employees, faculties, userGrowth, roleData })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────
// ALL USERS  (every role)
// @route  GET /api/superadmin/users
// ─────────────────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────
// UPDATE ANY USER  (role, details — SuperAdmin can change anything)
// @route  PUT /api/superadmin/users/:id
// ─────────────────────────────────────────────────────────────
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Prevent demoting the last SuperAdmin
    if (user.role === 'SuperAdmin' && req.body.role && req.body.role !== 'SuperAdmin') {
      const superAdminCount = await User.countDocuments({ role: 'SuperAdmin' })
      if (superAdminCount <= 1)
        return res.status(400).json({ message: 'Cannot demote the only SuperAdmin.' })
    }

    const allowed = ['fullName', 'email', 'phoneNumber', 'faculty', 'role', 'profileImage']
    allowed.forEach(field => {
      if (req.body[field] !== undefined) user[field] = req.body[field]
    })
    if (req.body.password) user.password = req.body.password

    const updated = await user.save()
    res.json({
      _id:      updated._id,
      fullName: updated.fullName,
      email:    updated.email,
      role:     updated.role,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────
// DELETE ANY USER
// @route  DELETE /api/superadmin/users/:id
// ─────────────────────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (user.role === 'SuperAdmin') {
      const count = await User.countDocuments({ role: 'SuperAdmin' })
      if (count <= 1)
        return res.status(400).json({ message: 'Cannot delete the only SuperAdmin.' })
    }

    await User.deleteOne({ _id: user._id })
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────
// GET ALL ADMINS
// @route  GET /api/superadmin/admins
// ─────────────────────────────────────────────────────────────
exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ['Admin', 'SuperAdmin'] } })
      .select('-password')
      .sort({ createdAt: -1 })
    res.json(admins)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────
// PROMOTE user → Admin
// @route  PUT /api/superadmin/promote/:id
// ─────────────────────────────────────────────────────────────
exports.promoteToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.role === 'Admin' || user.role === 'SuperAdmin')
      return res.status(400).json({ message: 'User is already an Admin or SuperAdmin.' })

    user.role = 'Admin'
    await user.save()
    res.json({ message: `${user.fullName} promoted to Admin.`, user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────
// DEMOTE Admin → Employee
// @route  PUT /api/superadmin/demote/:id
// ─────────────────────────────────────────────────────────────
exports.demoteAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.role === 'SuperAdmin')
      return res.status(400).json({ message: 'Cannot demote a SuperAdmin.' })
    if (user.role !== 'Admin')
      return res.status(400).json({ message: 'User is not an Admin.' })

    user.role = 'Employee'
    await user.save()
    res.json({ message: `${user.fullName} demoted to Employee.`, user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────
// CREATE ADMIN directly (SuperAdmin creates admin account)
// @route  POST /api/superadmin/admins
// ─────────────────────────────────────────────────────────────
exports.createAdmin = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body
    if (!fullName || !email || !phoneNumber || !password)
      return res.status(400).json({ message: 'All fields are required.' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already registered.' })

    const admin = await User.create({
      fullName,
      email,
      phoneNumber,
      faculty:  'N/A',
      password,
      role:     'Admin',
    })

    res.status(201).json({
      _id:      admin._id,
      fullName: admin.fullName,
      email:    admin.email,
      role:     admin.role,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────
// CREATE EMPLOYEE directly (SuperAdmin creates employee account)
// @route  POST /api/superadmin/employees
// ─────────────────────────────────────────────────────────────
exports.createEmployee = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, faculty, password } = req.body;

    if (!fullName || !email || !phoneNumber || !password)
      return res.status(400).json({ message: 'All fields are required.' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered.' });

    const employee = await User.create({
      fullName,
      email,
      phoneNumber,
      faculty: faculty || 'N/A',
      password,
      role: 'Employee',
    });

    res.status(201).json({
      _id:      employee._id,
      fullName: employee.fullName,
      email:    employee.email,
      role:     employee.role,
     
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};