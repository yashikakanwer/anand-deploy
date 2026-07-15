const mongoose = require('mongoose');

// Disable command buffering globally so queries fail fast rather than hanging
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    console.log(`Connecting to database: ${process.env.MONGODB_URI}...`);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Local MongoDB connection failed: ${error.message}`);
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      console.error('CRITICAL: MongoDB connection failed in production. Server will run without active DB connection to prevent Passenger crash loops.');
      return;
    }
    console.log('Attempting to start in-memory MongoDB fallback...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const fallbackUri = mongoServer.getUri();
      console.log(`In-Memory MongoDB server started at: ${fallbackUri}`);
      
      const conn = await mongoose.connect(fallbackUri);
      console.log(`Connected to Fallback In-Memory MongoDB: ${conn.connection.host}`);
      
      // Auto seed in background
      setTimeout(async () => {
        try {
          const autoSeed = require('./autoSeed');
          await autoSeed();
        } catch (seedErr) {
          console.error(`Auto seed error: ${seedErr.message}`);
        }
      }, 500);
      
    } catch (fallbackError) {
      console.error(`Failed to connect to fallback DB: ${fallbackError.message}`);
      console.error('Please make sure MongoDB is installed and running locally, or configure a valid MONGODB_URI in backend/.env.');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
