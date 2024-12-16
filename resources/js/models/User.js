const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'] // Email validation
  },
  num: { 
    type: String, 
    required: true, 
    validate: {
        validator: (v) => /^[0-9]{10,15}$/.test(v), // Allows 10-15 digit numbers
        message: 'is invalid',
    },
  },
  pass: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'] // Basic password validation
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Prefer not to say'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Model creation
const User = mongoose.model('User', userSchema);

module.exports = User;
