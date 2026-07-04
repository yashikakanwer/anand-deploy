const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { protect } = require('../middleware/auth');

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ date: -1 });
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
    const newInquiry = new Inquiry({
      id: `inq-${Date.now()}`,
      name,
      company,
      email,
      phone,
      service,
      message,
      status: 'Pending',
      date: new Date()
    });

    await newInquiry.save();
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
    const inquiry = await Inquiry.findOne({ id: req.params.id });

    if (inquiry) {
      inquiry.status = status || inquiry.status;
      await inquiry.save();
      
      const allInquiries = await Inquiry.find({}).sort({ date: -1 });
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
    const inquiry = await Inquiry.findOne({ id: req.params.id });

    if (inquiry) {
      await Inquiry.deleteOne({ id: req.params.id });
      const allInquiries = await Inquiry.find({}).sort({ date: -1 });
      res.json(allInquiries);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
