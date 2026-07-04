const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({});
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
    const slug = id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const projectId = id || `proj-${Date.now()}`;

    let project = await Project.findOne({ id: projectId });

    if (project) {
      project.title = title || project.title;
      project.clientName = clientName || project.clientName;
      project.location = location || project.location;
      project.scope = scope || project.scope;
      project.completionYear = completionYear || project.completionYear;
      project.challenges = challenges || project.challenges;
      project.solutions = solutions || project.solutions;
      project.results = results || project.results;
      project.image = image || project.image;
      await project.save();
    } else {
      project = new Project({
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
      await project.save();
    }

    const allProjects = await Project.find({});
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
    const project = await Project.findOne({ id: req.params.id });

    if (project) {
      await Project.deleteOne({ id: req.params.id });
      const allProjects = await Project.find({});
      res.json(allProjects);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
