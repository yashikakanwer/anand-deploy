const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const dbHelper = require('../config/dbHelper');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await dbHelper.find(Project, 'projects.json');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create or update project
// @route   POST /api/projects
// @access  Private
router.post('/', protect, async (req, res) => {
  const { id, title, clientName, location, scope, completionYear, challenges, solutions, results, image } = req.body;

  try {
    const projectId = id || `proj-${Date.now()}`;
    const slug = id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await dbHelper.save(Project, 'projects.json', 'id', projectId, {
      id: projectId,
      slug,
      title,
      clientName,
      location,
      scope,
      completionYear,
      challenges,
      solutions,
      results,
      image
    });

    const allProjects = await dbHelper.find(Project, 'projects.json');
    res.json(allProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await dbHelper.deleteOne(Project, 'projects.json', 'id', req.params.id);
    if (deleted) {
      const allProjects = await dbHelper.find(Project, 'projects.json');
      res.json(allProjects);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
