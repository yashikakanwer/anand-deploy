const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  page: {
    type: String,
    required: true
  },
  device: {
    type: String,
    default: 'Desktop'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
