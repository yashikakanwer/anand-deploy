const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({});
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
    let job = await Job.findOne({ id: jobId });

    if (job) {
      job.title = title || job.title;
      job.location = location || job.location;
      job.type = type || job.type;
      job.reqs = reqs || job.reqs;
      await job.save();
    } else {
      job = new Job({
        id: jobId,
        title,
        location,
        type,
        reqs
      });
      await job.save();
    }

    const allJobs = await Job.find({});
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
    const job = await Job.findOne({ id: req.params.id });

    if (job) {
      await Job.deleteOne({ id: req.params.id });
      const allJobs = await Job.find({});
      res.json(allJobs);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
