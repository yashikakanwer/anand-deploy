const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({});
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
    const slug = id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const serviceId = id || `serv-${Date.now()}`;

    let service = await Service.findOne({ id: serviceId });

    if (service) {
      service.title = title || service.title;
      service.description = description || service.description;
      service.features = features || service.features;
      await service.save();
    } else {
      service = new Service({
        id: serviceId,
        slug,
        title,
        description,
        features
      });
      await service.save();
    }

    const allServices = await Service.find({});
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
    const service = await Service.findOne({ id: req.params.id });

    if (service) {
      await Service.deleteOne({ id: req.params.id });
      const allServices = await Service.find({});
      res.json(allServices);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
