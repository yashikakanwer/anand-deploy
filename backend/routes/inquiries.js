const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { protect } = require('../middleware/auth');
const dbHelper = require('../config/dbHelper');

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const inquiries = await dbHelper.find(Inquiry, 'inquiries.json', {}, { date: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Public
router.post('/', async (req, res) => {
  const { name, company, email, phone, service, message } = req.body;

  try {
    const inqId = `inq-${Date.now()}`;
    const newInquiry = {
      id: inqId,
      name,
      company,
      email,
      phone,
      service,
      message,
      status: 'Pending',
      date: new Date()
    };

    await dbHelper.save(Inquiry, 'inquiries.json', 'id', inqId, newInquiry);
    res.status(201).json(newInquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { status } = req.body;

  try {
    const inquiry = await dbHelper.findOne(Inquiry, 'inquiries.json', { id: req.params.id });

    if (inquiry) {
      await dbHelper.save(Inquiry, 'inquiries.json', 'id', req.params.id, {
        status: status || inquiry.status
      });
      
      const allInquiries = await dbHelper.find(Inquiry, 'inquiries.json', {}, { date: -1 });
      res.json(allInquiries);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await dbHelper.deleteOne(Inquiry, 'inquiries.json', 'id', req.params.id);
    if (deleted) {
      const allInquiries = await dbHelper.find(Inquiry, 'inquiries.json', {}, { date: -1 });
      res.json(allInquiries);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
