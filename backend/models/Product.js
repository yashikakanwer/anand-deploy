const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
  name: {
    type: String,
    required: true
  },
  shortDescription: String,
  description: String,
  specs: [
    {
      name: String,
      value: String
    }
  ],
  features: [String],
  applications: [String],
  catalogName: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
