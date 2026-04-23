import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('TIP: Check if your IP address is whitelisted in MongoDB Atlas (Network Access).');
    // Don't exit immediately, maybe it's transient
    setTimeout(connectDB, 5000); 
  }
};


export default connectDB;
