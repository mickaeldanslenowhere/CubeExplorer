// Final Two-Phase Algorithm implementation
// This version uses real move tables based on the original Pascal code

import { CancellationManager } from '../utils/CancellationManager';
import { Logger } from '../utils/Logger';

import { 
  TWO_PHASE_CONSTANTS 
} from '../types/TwoPhaseTypes';
import CubeState from '@cube-explorer/shared/src/cube/CubeState';
import { applyMove, cubeMoves } from '@cube-explorer/shared';

export class FinalTwoPhaseSolver {
  // Constants from original Pascal code
  private static readonly MAX_PHASE1_DEPTH = TWO_PHASE_CONSTANTS.MAX_PHASE1_DEPTH;
  private static readonly MAX_PHASE2_DEPTH = TWO_PHASE_CONSTANTS.MAX_PHASE2_DEPTH;
  private static readonly MAX_TOTAL_DEPTH = TWO_PHASE_CONSTANTS.MAX_TOTAL_DEPTH;


  /**
   * Solve a cube using the final Two-Phase Algorithm with real-time logs
   * @param cube - The cube to solve
   */
  static async solveWithLogs(cube: CubeState): Promise<string[]> {
    const startTime = Date.now();
    Logger.log('Starting Two-Phase Algorithm...', { sendToFrontend: true });
    
    // Phase 1: Solve to subgroup H
    const phase1StartTime = Date.now();
    const phase1Solution = await this.solvePhase1(cube);
    const phase1Time = Date.now() - phase1StartTime;
    Logger.info(`Phase 1 completed in ${phase1Time}ms with solution: [${phase1Solution.join(', ')}]`, { sendToFrontend: true });
    
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      Logger.error('Operation was cancelled by user', { sendToFrontend: true });
      return [];
    }
 
    
    // Combine solutions
    const totalSolution = [...phase1Solution];
    
    const totalTime = Date.now() - startTime;
    Logger.info(`Two-Phase Algorithm completed successfully in ${totalTime}ms`, { sendToFrontend: true });
    Logger.info(`Total solution: [${totalSolution.join(', ')}]`, { sendToFrontend: true });
    
    return totalSolution;
  }

  /**
   * Solve Phase 1 using IDA* search with real move tables
   * @param state - Phase 1 state
   */
  private static async solvePhase1(state: CubeState): Promise<string[]> {
    if (state.isSolved()) {
      Logger.info('Phase 1 already solved', { sendToFrontend: true });
      return [];
    }

    Logger.info(`Starting Phase 1 search (max depth: ${this.MAX_PHASE1_DEPTH})`, { sendToFrontend: true });
    
    // IDA* search
    for (let depth = 0; depth <= this.MAX_PHASE1_DEPTH; depth++) {
      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        Logger.error('Operation was cancelled by user', { sendToFrontend: true });
        return [];
      }
      
      // Sleep .5 seconds before each depth change
      if (depth > 0) {
        // free the thread a bit
        await new Promise(resolve => setImmediate(resolve));
        
        // Check if operation was cancelled during sleep
        if (CancellationManager.isCancelled) {
          Logger.error('Operation was cancelled by user during sleep', { sendToFrontend: true });
          return [];
        }
      }
      
      const depthStartTime = Date.now();
      Logger.info(`Searching Phase 1 at depth ${depth}...`, { sendToFrontend: true });
      
      try {
        const solution = await this.searchPhase1(state, depth, []);
        const depthTime = Date.now() - depthStartTime;
        
        if (solution.length > 0) {
          Logger.info(`Phase 1 solution found at depth ${depth} in ${depthTime}ms: [${solution.join(', ')}]`, { sendToFrontend: true, prefix: '✅' });
          return solution;
        } else {
          Logger.info(`No solution found at depth ${depth} in ${depthTime}ms`, { sendToFrontend: true, prefix: '❌' });
          
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'Operation was cancelled') {
          Logger.warn(`Phase 1 search cancelled at depth ${depth}`, { sendToFrontend: true, prefix: '⚠️' });
          throw error;
        }
        throw error;
      }
    }

    Logger.error('Phase 1 search failed - no solution found', { sendToFrontend: true, prefix: '❌' });
    return [];
  }


  /**
   * IDA* search for Phase 1 with real move tables
   * @param state - Current Phase 1 state
   * @param depth - Remaining depth
   * @param path - Current move path
   */
  private static async searchPhase1(state: CubeState, depth: number, path: string[]): Promise<string[]> {
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      Logger.error('Operation was cancelled by user', { sendToFrontend: true, prefix: '❌' });
      return [];
    }

    if (depth === 0) {
      return state.isSolved() ? path : [];
    }

    // Try all moves
    let moveCount = 0;
    for (const move of cubeMoves) {
      const workingState = state.clone();
      if (CancellationManager.isCancelled) {
        Logger.error('Operation was cancelled by user during search', { sendToFrontend: true, prefix: '❌' });
        return [];
      }
      moveCount++;

      const newPath = [...path, move];
      // Log the current move being tested
      Logger.debug(`🔍 Phase 1 testing move: ${move} (path: [${newPath.join(', ')}])`);
      applyMove(workingState, move);

      const solution = await this.searchPhase1(workingState, depth - 1, newPath);
      if (solution.length > 0) {
        return solution;
      }

      // Wait 0.001 seconds between each move test
      await new Promise(resolve => setImmediate(resolve));
    }

    return [];
  }

  /**
   * Check if a move is redundant
   */
  private static isRedundantMove(path: string[], move: string): boolean {
    if (path.length === 0) return false;
    
    const lastMove = path[path.length - 1];
    const lastFace = lastMove[0];
    const currentFace = move[0];
    
    // Don't repeat the same face
    if (lastFace === currentFace) return true;
    
    // Don't do opposite faces consecutively
    const oppositeFaces: { [key: string]: string } = {
      'U': 'D', 'D': 'U',
      'R': 'L', 'L': 'R',
      'F': 'B', 'B': 'F'
    };
    
    return oppositeFaces[lastFace] === currentFace;
  }
}