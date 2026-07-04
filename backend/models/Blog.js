const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
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
  summary: String,
  content: String,
  author: String,
  date: String,
  readTime: String
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
