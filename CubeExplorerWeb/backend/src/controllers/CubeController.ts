import { Request, Response } from 'express';
import { CancellationManager } from '../utils/CancellationManager';
import { Logger } from '../utils/Logger';
import { SolveService } from '../services/SolveService';
import { ScrambleService } from '../services/ScrambleService';

export class CubeController {

  /**
   * Logs stream endpoint for real-time logging
   */
  static async logsStream(req: Request, res: Response): Promise<void> {
    Logger.log('📡 [API] Logs stream connection established');
    
    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Set up the log stream for the Logger
    const sendLog = (message: string) => {
      res.write(`data: ${JSON.stringify({ type: 'log', message })}\n\n`);
    };

    Logger.setLogStream(sendLog);

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Logs stream connected' })}\n\n`);

    // Handle client disconnect
    req.on('close', () => {
      Logger.log('📡 [API] Logs stream connection closed');
      Logger.clearLogStream();
    });

    req.on('aborted', () => {
      Logger.log('📡 [API] Logs stream connection aborted');
      Logger.clearLogStream();
    });
  }



  /**
   * Solve a cube from a scramble string with real-time logs
   */
  static async solveCube(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    Logger.log(`🔧 [API] Solve request received at ${new Date().toISOString()}`);
    
    // Reset cancellation flag
    CancellationManager.reset();
    
    try {
      let cubeStateString = req.query.cubeState as string;
      Logger.log(`📝 [API] CubeState received: "${cubeStateString}"`);
      
      if (!cubeStateString) {
        Logger.error('❌ [API] No cubeState provided');
        res.status(400).json({ error: 'CubeState is required' });
        return;
      }

      if (typeof cubeStateString !== 'string') {
        Logger.error('❌ [API] CubeState is not a string');
        res.status(400).json({ error: 'CubeState must be a string' });
        return;
      }

      // Parse the cubeState string
      let cubeState;
      try {
        cubeState = JSON.parse(cubeStateString);
        Logger.log(`📦 [API] CubeState parsed successfully`);
      } catch (parseError) {
        Logger.error('❌ [API] Failed to parse cubeState JSON');
        res.status(400).json({ error: 'Invalid cubeState JSON format' });
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

      // Set up the log stream for the Logger
      const sendLog = (message: string) => {
        res.write(`data: ${JSON.stringify({ type: 'log', message })}\n\n`);
      };

      Logger.setLogStream(sendLog);

      const sendResult = (result: any) => {
        Logger.log(`📡 [SSE] Result: ${JSON.stringify(result)}`);
        res.write(`data: ${JSON.stringify({ type: 'result', data: result })}\n\n`);
        res.end();
      };

      const sendError = (error: string) => {
        Logger.error(`📡 [SSE] Error: ${error}`);
        res.write(`data: ${JSON.stringify({ type: 'error', message: error })}\n\n`);
        res.end();
      };

      Logger.log('🚀 [API] Calling SolveService.solveCubeWithLogs with real-time logs...');
      
      // Call the service with real-time logging
      const result = await SolveService.solveCubeWithLogs(cubeState);
      
      const totalTime = Date.now() - startTime;
      Logger.log(`✅ [API] Solve request completed in ${totalTime}ms`);
      
      sendResult(result);
    } catch (error) {
      const totalTime = Date.now() - startTime;
      
      if (CancellationManager.isCancelled) {
        Logger.warn(`⚠️ [API] Solve operation was cancelled after ${totalTime}ms`);
        if (!res.headersSent) {
          Logger.log(`📡 [SSE] Error: Request was cancelled`);
          res.write(`data: ${JSON.stringify({ type: 'error', message: 'Request was cancelled' })}\n\n`);
          res.end();
        }
      } else {
        Logger.error(`❌ [API] Error solving cube after ${totalTime}ms:`, { prefix: '[API]' });
        if (!res.headersSent) {
          Logger.log(`📡 [SSE] Error: Failed to solve cube`);
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
    Logger.warn('⚠️ [API] Cancel request received');
    CancellationManager.cancel();
    res.json({ message: 'Solve operation cancelled' });
  }

  /**
   * Test cancellation endpoint
   */
  static async testCancel(req: Request, res: Response): Promise<void> {
    Logger.log('🧪 [API] Test cancel request received');
    
    const abortController = new AbortController();
    let isRequestAborted = false;
    
    req.on('close', () => {
      Logger.warn('⚠️ [API] Test request disconnected');
      isRequestAborted = true;
      abortController.abort();
    });
    
    try {
      // Simulate long running operation
      for (let i = 0; i < 100; i++) {
        if (abortController.signal.aborted) {
          Logger.warn(`⚠️ [API] Test operation cancelled at step ${i}`);
          throw new Error('Operation was cancelled');
        }
        
        // Simulate work
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (isRequestAborted) {
          Logger.warn(`⚠️ [API] Test operation aborted at step ${i}`);
          return;
        }
      }
      
      res.json({ message: 'Test completed successfully' });
    } catch (error) {
      if (isRequestAborted || error instanceof Error && error.message === 'Operation was cancelled') {
        Logger.warn('⚠️ [API] Test operation was cancelled');
        if (!res.headersSent) {
          res.status(499).json({ error: 'Request was cancelled' });
        }
      } else {
        Logger.error('❌ [API] Test error:', { prefix: '[API]' });
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
    Logger.log(`🎲 [API] Generate scramble request received at ${new Date().toISOString()}`);
    
    try {
      Logger.log('🚀 [API] Calling ScrambleService.generateScramble...');
      const result = await ScrambleService.generateScramble();
      const totalTime = Date.now() - startTime;
      
      Logger.log(`✅ [API] Generate scramble request completed in ${totalTime}ms`);
      Logger.log(`📤 [API] Returning result: ${JSON.stringify(result)}`);
      
      res.json(result);
    } catch (error) {
      const totalTime = Date.now() - startTime;
      Logger.error(`❌ [API] Error generating scramble after ${totalTime}ms:`, { prefix: '[API]' });
      res.status(500).json({ error: 'Failed to generate scramble' });
    }
  }
}
