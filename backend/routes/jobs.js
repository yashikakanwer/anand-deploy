const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');
const dbHelper = require('../config/dbHelper');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const jobs = await dbHelper.find(Job, 'jobs.json');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create or update a job
// @route   POST /api/jobs
// @access  Private
router.post('/', protect, async (req, res) => {
  const { id, title, location, type, reqs } = req.body;

  try {
    const jobId = id || `job-${Date.now()}`;

    await dbHelper.save(Job, 'jobs.json', 'id', jobId, {
      id: jobId,
      title,
      location,
      type,
      reqs
    });

    const allJobs = await dbHelper.find(Job, 'jobs.json');
    res.json(allJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await dbHelper.deleteOne(Job, 'jobs.json', 'id', req.params.id);
    if (deleted) {
      const allJobs = await dbHelper.find(Job, 'jobs.json');
      res.json(allJobs);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
