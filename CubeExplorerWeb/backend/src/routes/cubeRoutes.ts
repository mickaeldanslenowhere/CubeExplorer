import { Router } from 'express';
import { CubeController } from '../controllers/CubeController';

const router = Router();


// Logs stream
router.get('/logs-stream', CubeController.logsStream);


// Solve cube
router.get('/solve', CubeController.solveCube);

// Cancel solve
router.post('/cancel', CubeController.cancelSolve);

// Generate scramble
router.get('/generate-scramble', CubeController.generateScramble);

// Test cancellation
router.get('/test-cancel', CubeController.testCancel);

export default router;
