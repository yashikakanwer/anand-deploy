const mongoose = require('mongoose');

const uri = 'mongodb+srv://anand2026:anand@cluster0.okfpdme.mongodb.net/anand_db?retryWrites=true&w=majority';

console.log("Connecting to MongoDB Atlas...");
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection failed:", err.message);
    process.exit(1);
  });
