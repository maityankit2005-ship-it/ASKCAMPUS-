const mongoose = require('mongoose');

// Connect to MongoDB using MONGO_URI (or MONGODB_URI) environment variable
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        'MONGO_URI (or MONGODB_URI) is not defined in environment variables.'
      );
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
