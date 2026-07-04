const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create or update product (upsert/save logic)
// @route   POST /api/products
// @access  Private
router.post('/', protect, async (req, res) => {
  const { id, name, shortDescription, description, specs, features, applications, catalogName, image } = req.body;

  try {
    const slug = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const productId = id || `prod-${Date.now()}`;

    // Find and update if exists, otherwise create
    let product = await Product.findOne({ id: productId });

    if (product) {
      product.name = name || product.name;
      product.shortDescription = shortDescription || product.shortDescription;
      product.description = description || product.description;
      product.specs = specs || product.specs;
      product.features = features || product.features;
      product.applications = applications || product.applications;
      product.catalogName = catalogName || product.catalogName;
      product.image = image || product.image;
      await product.save();
    } else {
      product = new Product({
        id: productId,
        slug,
        name,
        shortDescription,
        description,
        specs,
        features,
        applications,
        catalogName,
        image
      });
      await product.save();
    }

    const allProducts = await Product.find({});
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });

    if (product) {
      await Product.deleteOne({ id: req.params.id });
      const allProducts = await Product.find({});
      res.json(allProducts);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
