import { Request, Response } from 'express';
import { CubeService } from '../services/CubeService';

export class CubeController {
  /**
   * Health check endpoint
   */
  static async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({
      status: 'OK',
      message: 'CubeExplorer API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }

  /**
   * Get available algorithms
   */
  static async getAlgorithms(req: Request, res: Response): Promise<void> {
    try {
      const algorithms = CubeService.getAlgorithms();
      res.json(algorithms);
    } catch (error) {
      console.error('Error getting algorithms:', error);
      res.status(500).json({ error: 'Failed to get algorithms' });
    }
  }

  /**
   * Solve a cube
   */
  static async solveCube(req: Request, res: Response): Promise<void> {
    try {
      const { cubeState } = req.body;
      
      if (!cubeState) {
        res.status(400).json({ error: 'Cube state is required' });
        return;
      }

      if (!CubeService.validateCubeState(cubeState)) {
        res.status(400).json({ error: 'Invalid cube state' });
        return;
      }

      const result = await CubeService.solveCube(cubeState);
      res.json(result);
    } catch (error) {
      console.error('Error solving cube:', error);
      res.status(500).json({ error: 'Failed to solve cube' });
    }
  }

  /**
   * Generate a scramble
   */
  static async generateScramble(req: Request, res: Response): Promise<void> {
    try {
      const result = await CubeService.generateScramble();
      res.json(result);
    } catch (error) {
      console.error('Error generating scramble:', error);
      res.status(500).json({ error: 'Failed to generate scramble' });
    }
  }
}
