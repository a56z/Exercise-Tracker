const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
  username: {
    type: String,
    required: true,
    unique: true
  }
});
const User = mongoose.model('User', userSchema);
exports.User = User;

const exerciseSchema = new Schema ({
  user_id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
const Exercise = mongoose.model('Exercise', exerciseSchema);
exports.Exercise = Exercise;