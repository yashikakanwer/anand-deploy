const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  reqs: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
