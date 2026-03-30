const jwt  = require('jsonwebtoken')
const User = require('../Model/User Management/UserModel')

// Verify JWT and attach user to req
const protect = async (req, res, next) => {
  let token
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token)
    return res.status(401).json({ success: false, message: 'Not authorised — no token' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'learnbuddy_secret_123')
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user)
      return res.status(401).json({ success: false, message: 'User no longer exists' })
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' })
  }
}

// Restrict to specific roles  e.g. authorise('Admin', 'SuperAdmin')
const authorise = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Role "${req.user.role}" is not allowed to perform this action`,
    })
  }
  next()
}

// Shorthand guard — only SuperAdmin gets through
const requireSuperAdmin = [
  protect,
  authorise('SuperAdmin'),
]

module.exports = { protect, authorise, requireSuperAdmin }