const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Give the title of task'],
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  isCompleted: {
    type: Boolean,
    default: false
  },

  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {timestamps: true})



module.exports = mongoose.model('Todo', todoSchema);