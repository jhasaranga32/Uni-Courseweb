const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName:     { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  phoneNumber:  { type: String, required: true },
  faculty:      { type: String, required: false },   // not required for Admin/SuperAdmin
  password:     { type: String, required: true },
  profileImage: { type: String, default: '' },
  role: {
    type:    String,
    enum:    ['Student', 'Employee', 'Admin', 'SuperAdmin'],  // ← SuperAdmin added
    default: 'Student',
  },
  resetOtp:       { type: String },
  resetOtpExpire: { type: Date },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);