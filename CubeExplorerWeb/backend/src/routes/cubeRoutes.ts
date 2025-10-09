import { Router } from 'express';
import { CubeController } from '../controllers/CubeController';

const router = Router();

// Health check
router.get('/health', CubeController.healthCheck);

// Get available algorithms
router.get('/algorithms', CubeController.getAlgorithms);

// Solve cube
router.post('/solve', CubeController.solveCube);
router.get('/solve-stream', CubeController.solveCubeStream);

// Cancel solve
router.post('/cancel', CubeController.cancelSolve);

// Generate scramble
router.get('/generate-scramble', CubeController.generateScramble);

// Test cancellation
router.get('/test-cancel', CubeController.testCancel);

export default router;
