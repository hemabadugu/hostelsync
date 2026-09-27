const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostelsync', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🍃 [MongoDB] Database Connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.warn(`⚠️  [MongoDB] Local DB connection warning: ${error.message}`);
    console.warn(`👉 Make sure MongoDB service is running on 127.0.0.1:27017 or update MONGO_URI in server/.env`);
  }
};

module.exports = connectDB;
