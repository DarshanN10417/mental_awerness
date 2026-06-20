import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

// Load environmental parameters
dotenv.config();

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`MindSprint AI Server Running on Port: ${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database Status: ${process.env.USE_MEMORY_DB === 'true' ? 'IN-MEMORY MOCK' : 'MONGODB'}`);
    console.log(`AI Configuration: ${process.env.USE_MOCK_AI === 'true' || !process.env.GEMINI_API_KEY ? 'MOCK' : 'GEMINI API'}`);
    console.log(`==========================================`);
  });
};

startServer();
