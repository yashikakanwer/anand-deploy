const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');
const dbHelper = require('../config/dbHelper');

// Make sure uploads folder exists
const uploadDir = process.env.VERCEL
  ? '/tmp'
  : path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' && ext !== '.doc' && ext !== '.docx') {
      return cb(new Error('Only PDF or Word documents are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const apps = await dbHelper.find(Application, 'applications.json', {}, { date: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new application (Submit resume)
// @route   POST /api/applications
// @access  Public
router.post('/', upload.single('resume'), async (req, res) => {
  const { name, email, phone, jobTitle } = req.body;
  const cvName = req.file ? req.file.filename : (req.body.cvName || 'resume_uploaded.pdf');

  try {
    const appId = `app-${Date.now()}`;
    const newApp = {
      id: appId,
      name,
      email,
      phone: phone || 'N/A',
      jobTitle: jobTitle || 'General Application',
      status: 'Pending',
      cvName,
      date: new Date()
    };

    await dbHelper.save(Application, 'applications.json', 'id', appId, newApp);
    res.status(201).json(newApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { status } = req.body;

  try {
    const app = await dbHelper.findOne(Application, 'applications.json', { id: req.params.id });

    if (app) {
      await dbHelper.save(Application, 'applications.json', 'id', req.params.id, {
        status: status || app.status
      });

      const allApps = await dbHelper.find(Application, 'applications.json', {}, { date: -1 });
      res.json(allApps);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const app = await dbHelper.findOne(Application, 'applications.json', { id: req.params.id });

    if (app) {
      // If there is an uploaded file, delete it from disk
      if (app.cvName && app.cvName !== 'resume_uploaded.pdf') {
        const filePath = path.join(uploadDir, app.cvName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await dbHelper.deleteOne(Application, 'applications.json', 'id', req.params.id);
      const allApps = await dbHelper.find(Application, 'applications.json', {}, { date: -1 });
      res.json(allApps);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Download application CV
// @route   GET /api/applications/download/:cvName
// @access  Private
router.get('/download/:cvName', protect, (req, res) => {
  const filePath = path.join(uploadDir, req.params.cvName);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

module.exports = router;
