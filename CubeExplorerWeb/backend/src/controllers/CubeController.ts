import { Request, Response } from 'express';
import { CubeService } from '../services/CubeService';
import { CancellationManager } from '../utils/CancellationManager';

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
   * Solve a cube from a scramble string with real-time logs
   */
  static async solveCube(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    console.log(`🔧 [API] Solve request received at ${new Date().toISOString()}`);
    
    // Reset cancellation flag
    CancellationManager.reset();
    
    try {
      const { scramble } = req.body;
      console.log(`📝 [API] Scramble received: "${scramble}"`);
      
      if (!scramble) {
        console.log('❌ [API] No scramble provided');
        res.status(400).json({ error: 'Scramble string is required' });
        return;
      }

      if (typeof scramble !== 'string') {
        console.log('❌ [API] Scramble is not a string');
        res.status(400).json({ error: 'Scramble must be a string' });
        return;
      }

      // Set up Server-Sent Events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      const sendLog = (message: string) => {
        res.write(`data: ${JSON.stringify({ type: 'log', message })}\n\n`);
      };

      const sendResult = (result: any) => {
        res.write(`data: ${JSON.stringify({ type: 'result', data: result })}\n\n`);
        res.end();
      };

      const sendError = (error: string) => {
        res.write(`data: ${JSON.stringify({ type: 'error', message: error })}\n\n`);
        res.end();
      };

      console.log('🚀 [API] Calling CubeService.solveCube with real-time logs...');
      
      // Call the service with real-time logging
      const result = await CubeService.solveCubeWithLogs(scramble, sendLog);
      
      const totalTime = Date.now() - startTime;
      console.log(`✅ [API] Solve request completed in ${totalTime}ms`);
      
      sendResult(result);
    } catch (error) {
      const totalTime = Date.now() - startTime;
      
      if (CancellationManager.isCancelled) {
        console.log(`⚠️ [API] Solve operation was cancelled after ${totalTime}ms`);
        if (!res.headersSent) {
          res.write(`data: ${JSON.stringify({ type: 'error', message: 'Request was cancelled' })}\n\n`);
          res.end();
        }
      } else {
        console.error(`❌ [API] Error solving cube after ${totalTime}ms:`, error);
        if (!res.headersSent) {
          res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to solve cube' })}\n\n`);
          res.end();
        }
      }
    }
  }

  /**
   * Solve a cube from a scramble string with real-time logs via Server-Sent Events
   */
  static async solveCubeStream(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    console.log(`🔧 [API] Solve stream request received at ${new Date().toISOString()}`);
    
    // Reset cancellation flag
    CancellationManager.reset();
    
    try {
      const { scramble } = req.query;
      console.log(`📝 [API] Scramble received: "${scramble}"`);
      
      if (!scramble || typeof scramble !== 'string') {
        console.log('❌ [API] No scramble provided');
        res.status(400).json({ error: 'Scramble string is required' });
        return;
      }

      // Set up Server-Sent Events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      const sendLog = (message: string) => {
        res.write(`data: ${JSON.stringify({ type: 'log', message })}\n\n`);
      };

      const sendResult = (result: any) => {
        res.write(`data: ${JSON.stringify({ type: 'result', data: result })}\n\n`);
        res.end();
      };

      const sendError = (error: string) => {
        res.write(`data: ${JSON.stringify({ type: 'error', message: error })}\n\n`);
        res.end();
      };

      console.log('🚀 [API] Calling CubeService.solveCube with real-time logs...');
      
      // Call the service with real-time logging
      const result = await CubeService.solveCubeWithLogs(scramble, sendLog);
      
      const totalTime = Date.now() - startTime;
      console.log(`✅ [API] Solve stream request completed in ${totalTime}ms`);
      
      sendResult(result);
    } catch (error) {
      const totalTime = Date.now() - startTime;
      
      if (CancellationManager.isCancelled) {
        console.log(`⚠️ [API] Solve operation was cancelled after ${totalTime}ms`);
        if (!res.headersSent) {
          res.write(`data: ${JSON.stringify({ type: 'error', message: 'Request was cancelled' })}\n\n`);
          res.end();
        }
      } else {
        console.error(`❌ [API] Error solving cube after ${totalTime}ms:`, error);
        if (!res.headersSent) {
          res.write(`data: ${JSON.stringify({ type: 'error', message: 'Failed to solve cube' })}\n\n`);
          res.end();
        }
      }
    }
  }

  /**
   * Cancel current solve operation
   */
  static async cancelSolve(req: Request, res: Response): Promise<void> {
    console.log('⚠️ [API] Cancel request received');
    CancellationManager.cancel();
    res.json({ message: 'Solve operation cancelled' });
  }

  /**
   * Test cancellation endpoint
   */
  static async testCancel(req: Request, res: Response): Promise<void> {
    console.log('🧪 [API] Test cancel request received');
    
    const abortController = new AbortController();
    let isRequestAborted = false;
    
    req.on('close', () => {
      console.log('⚠️ [API] Test request disconnected');
      isRequestAborted = true;
      abortController.abort();
    });
    
    try {
      // Simulate long running operation
      for (let i = 0; i < 100; i++) {
        if (abortController.signal.aborted) {
          console.log(`⚠️ [API] Test operation cancelled at step ${i}`);
          throw new Error('Operation was cancelled');
        }
        
        // Simulate work
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (isRequestAborted) {
          console.log(`⚠️ [API] Test operation aborted at step ${i}`);
          return;
        }
      }
      
      res.json({ message: 'Test completed successfully' });
    } catch (error) {
      if (isRequestAborted || error instanceof Error && error.message === 'Operation was cancelled') {
        console.log('⚠️ [API] Test operation was cancelled');
        if (!res.headersSent) {
          res.status(499).json({ error: 'Request was cancelled' });
        }
      } else {
        console.error('❌ [API] Test error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Test failed' });
        }
      }
    }
  }

  /**
   * Generate a scramble
   */
  static async generateScramble(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    console.log(`🎲 [API] Generate scramble request received at ${new Date().toISOString()}`);
    
    try {
      console.log('🚀 [API] Calling CubeService.generateScramble...');
      const result = await CubeService.generateScramble();
      const totalTime = Date.now() - startTime;
      
      console.log(`✅ [API] Generate scramble request completed in ${totalTime}ms`);
      console.log(`📤 [API] Returning result: ${JSON.stringify(result)}`);
      
      res.json(result);
    } catch (error) {
      const totalTime = Date.now() - startTime;
      console.error(`❌ [API] Error generating scramble after ${totalTime}ms:`, error);
      res.status(500).json({ error: 'Failed to generate scramble' });
    }
  }
}
