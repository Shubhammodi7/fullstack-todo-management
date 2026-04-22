const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email address" ],
    unique: [ true, "Email already exists." ]
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  token: {
    type: String
  }
});

userSchema.pre('save', async function() { // Removed 'next' from parameters
  if (!this.isModified('password')) {
    return; // Just return instead of calling next()
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.log("Hashing Error:", err);
    throw err;
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model('User', userSchema);