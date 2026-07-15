const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect } = require('../middleware/auth');
const dbHelper = require('../config/dbHelper');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const blogs = await dbHelper.find(Blog, 'blogs.json');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create or update blog
// @route   POST /api/blogs
// @access  Private
router.post('/', protect, async (req, res) => {
  const { id, title, summary, content, author, date, readTime } = req.body;

  try {
    const blogId = id || `blog-${Date.now()}`;
    const slug = id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const formattedDate = date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    await dbHelper.save(Blog, 'blogs.json', 'id', blogId, {
      id: blogId,
      slug,
      title,
      summary,
      content,
      author,
      date: formattedDate,
      readTime: readTime || '5 min read'
    });

    const allBlogs = await dbHelper.find(Blog, 'blogs.json');
    res.json(allBlogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await dbHelper.deleteOne(Blog, 'blogs.json', 'id', req.params.id);
    if (deleted) {
      const allBlogs = await dbHelper.find(Blog, 'blogs.json');
      res.json(allBlogs);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
