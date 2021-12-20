const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  short_url: {
    type: Number,
    required: true
  },
  original_url: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Url', urlSchema);