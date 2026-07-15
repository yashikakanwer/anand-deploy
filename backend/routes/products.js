const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const dbHelper = require('../config/dbHelper');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await dbHelper.find(Product, 'products.json');
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
    const productId = id || `prod-${Date.now()}`;
    const slug = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await dbHelper.save(Product, 'products.json', 'id', productId, {
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

    const allProducts = await dbHelper.find(Product, 'products.json');
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
    const deleted = await dbHelper.deleteOne(Product, 'products.json', 'id', req.params.id);
    if (deleted) {
      const allProducts = await dbHelper.find(Product, 'products.json');
      res.json(allProducts);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
