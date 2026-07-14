require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files (like PDFs)
const uploadDir = process.env.VERCEL
  ? '/tmp'
  : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/services', require('./routes/services'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/visitors', require('./routes/visitors'));

// Default Route
app.get('/', (req, res) => {
  res.send('Anand Electricals API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
  });
}

module.exports = app;
