import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cubeRoutes from './routes/cubeRoutes';
import { Logger } from './utils/Logger';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', cubeRoutes);


app.listen(PORT, () => {
  Logger.log(`🚀 Server running on port ${PORT}`);
});
