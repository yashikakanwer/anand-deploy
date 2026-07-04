const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  clientName: String,
  location: String,
  scope: String,
  completionYear: String,
  challenges: String,
  solutions: String,
  results: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
