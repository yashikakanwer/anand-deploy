const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');
const dbHelper = require('../config/dbHelper');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await dbHelper.find(Service, 'services.json');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create or update service
// @route   POST /api/services
// @access  Private
router.post('/', protect, async (req, res) => {
  const { id, title, description, features } = req.body;

  try {
    const serviceId = id || `serv-${Date.now()}`;
    const slug = id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await dbHelper.save(Service, 'services.json', 'id', serviceId, {
      id: serviceId,
      slug,
      title,
      description,
      features
    });

    const allServices = await dbHelper.find(Service, 'services.json');
    res.json(allServices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await dbHelper.deleteOne(Service, 'services.json', 'id', req.params.id);
    if (deleted) {
      const allServices = await dbHelper.find(Service, 'services.json');
      res.json(allServices);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
