const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const { getFallbackData, isMongoConnected } = require('../config/fallbackDB');
const bcrypt = require('bcryptjs');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!isMongoConnected()) {
    try {
      const users = getFallbackData('users.json');
      const user = users.find(u => u.username === username);
      if (user && bcrypt.compareSync(password, user.password)) {
        return res.json({
          id: user.username,
          name: user.name,
          username: user.username,
          role: user.role,
          token: generateToken(user.username)
        });
      } else {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
