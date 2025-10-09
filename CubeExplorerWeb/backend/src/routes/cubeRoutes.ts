import { Router } from 'express';
import { CubeController } from '../controllers/CubeController';

const router = Router();

// Health check
router.get('/health', CubeController.healthCheck);

// Get available algorithms
router.get('/algorithms', CubeController.getAlgorithms);

// Solve cube
router.post('/solve', CubeController.solveCube);

// Generate scramble
router.get('/generate-scramble', CubeController.generateScramble);

export default router;
