const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFallbackData = (filename, defaultVal = []) => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return defaultVal;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    return defaultVal;
  }
};

const saveFallbackData = (filename, data) => {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = {
  getFallbackData,
  saveFallbackData,
  isMongoConnected
};
