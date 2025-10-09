import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { CubeSolver } from './services/CubeSolver';
import { CubeState, Move } from './types';
import cubeRoutes from './routes/cubeRoutes';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;
const cubeSolver = new CubeSolver();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', cubeRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Handle cube state updates
  socket.on('cube-update', (data: CubeState) => {
    console.log('Cube state updated:', data.id);
    socket.broadcast.emit('cube-update', data);
  });

  // Handle solve requests
  socket.on('solve-request', async (data: { cubeState: CubeState, algorithm?: string }) => {
    try {
      console.log('Solving cube with algorithm:', data.algorithm || 'CFOP');
      
      const result = cubeSolver.solveCube(data.cubeState);
      
      socket.emit('solve-response', {
        moves: result.moves,
        algorithm: result.algorithm,
        duration: result.duration,
        status: result.status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error solving cube:', error);
      socket.emit('solve-error', {
        message: 'Failed to solve cube',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Handle scramble requests
  socket.on('scramble-request', () => {
    try {
      const scrambleMoves = cubeSolver.scrambleCube();
      socket.emit('scramble-response', {
        moves: scrambleMoves,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating scramble:', error);
      socket.emit('scramble-error', {
        message: 'Failed to generate scramble',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Handle move validation
  socket.on('validate-move', (data: { move: string, cubeState: CubeState }) => {
    try {
      // TODO: Implement move validation
      const isValid = true; // Placeholder
      socket.emit('move-validation', {
        move: data.move,
        isValid,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error validating move:', error);
      socket.emit('move-validation-error', {
        message: 'Failed to validate move',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready`);
  console.log(`🔧 Cube solver initialized`);
});
