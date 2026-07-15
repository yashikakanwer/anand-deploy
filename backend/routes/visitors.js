const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const { protect } = require('../middleware/auth');
const dbHelper = require('../config/dbHelper');

// @desc    Log a new page visit
// @route   POST /api/visitors
// @access  Public
router.post('/', async (req, res) => {
  const { page, device } = req.body;
  
  // Normalize local IPv6 IP to IPv4
  let rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  if (rawIp === '::1' || rawIp === '::ffff:127.0.0.1') {
    rawIp = '127.0.0.1';
  } else if (rawIp.startsWith('::ffff:')) {
    rawIp = rawIp.replace('::ffff:', '');
  }

  try {
    const visitId = `visit-${Date.now()}`;
    const newVisit = {
      id: visitId,
      ip: rawIp,
      page: page || '/',
      device: device || 'Desktop',
      date: new Date()
    };

    await dbHelper.save(Visitor, 'visitors.json', 'id', visitId, newVisit);
    res.status(201).json(newVisit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all visitor logs
// @route   GET /api/visitors
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const logs = await dbHelper.find(Visitor, 'visitors.json', {}, { date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
