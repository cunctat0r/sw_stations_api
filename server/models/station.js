const mongoose = require('mongoose');

var Station = mongoose.model('Station', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  freq: {
    type: Number,
    required: true
  },
  online_begin: {
    type: Number,
    default: null
  },
  online_end: {
    type: Number,
    default: null
  },
  actual: {
    type: Boolean,
    default: false
  }
});

module.exports = {Station};
