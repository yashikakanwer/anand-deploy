const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect } = require('../middleware/auth');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({});
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
    const slug = id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const blogId = id || `blog-${Date.now()}`;

    let blog = await Blog.findOne({ id: blogId });

    if (blog) {
      blog.title = title || blog.title;
      blog.summary = summary || blog.summary;
      blog.content = content || blog.content;
      blog.author = author || blog.author;
      blog.date = date || blog.date;
      blog.readTime = readTime || blog.readTime;
      await blog.save();
    } else {
      const formattedDate = date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      blog = new Blog({
        id: blogId,
        slug,
        title,
        summary,
        content,
        author,
        date: formattedDate,
        readTime: readTime || '5 min read'
      });
      await blog.save();
    }

    const allBlogs = await Blog.find({});
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
    const blog = await Blog.findOne({ id: req.params.id });

    if (blog) {
      await Blog.deleteOne({ id: req.params.id });
      const allBlogs = await Blog.find({});
      res.json(allBlogs);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
