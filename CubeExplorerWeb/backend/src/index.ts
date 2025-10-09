import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { CubeSolver } from './services/CubeSolver';
import { CubeState, Move } from './types';

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
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CubeExplorer API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/algorithms', (req, res) => {
  res.json({
    methods: ['CFOP', 'Roux', 'ZZ', 'Petrus'],
    algorithms: {
      cross: ['F', 'R', 'U', 'R\'', 'F\''],
      f2l: ['R', 'U', 'R\'', 'U\''],
      oll: ['F', 'R', 'U', 'R\'', 'U\'', 'F\''],
      pll: ['R', 'U', 'R\'', 'F', 'R', 'U', 'R\'', 'F\'']
    }
  });
});

// Solve endpoint
app.post('/api/solve', async (req, res) => {
  try {
    const { cubeState } = req.body;
    
    if (!cubeState) {
      return res.status(400).json({ error: 'Cube state is required' });
    }

    // For now, return a simple solution
    const resolution = 'R U R';
    
    res.json({ resolution });
  } catch (error) {
    console.error('Error solving cube:', error);
    res.status(500).json({ error: 'Failed to solve cube' });
  }
});

// Generate scramble endpoint
app.get('/api/generate-scramble', async (req, res) => {
  try {
    // For now, return a simple scramble
    // Later this will generate a proper WCA-approved scramble
    const scramble = 'R U R';
    
    res.json({ scramble });
  } catch (error) {
    console.error('Error generating scramble:', error);
    res.status(500).json({ error: 'Failed to generate scramble' });
  }
});

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
