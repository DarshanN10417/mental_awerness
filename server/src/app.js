import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import interventionRoutes from './routes/interventionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json());

// Base health indicator
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    dbMode: process.env.USE_MEMORY_DB === 'true' ? 'in-memory' : 'mongodb',
    aiMode: process.env.USE_MOCK_AI === 'true' || !process.env.GEMINI_API_KEY ? 'mock' : 'gemini'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes); // Map profile updates to the same router
app.use('/api/mood', moodRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/insights', journalRoutes); // Support sub-routing checks if needed
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/interventions', interventionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
