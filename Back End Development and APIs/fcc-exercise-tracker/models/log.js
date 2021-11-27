const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  "_id": {
    type: String,
    required: true
  },
  "username": {
    type: String,
    required: true
  },
  "count": {
    type: Number,
    default: 0
  },
  "log": {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('Log', logSchema);