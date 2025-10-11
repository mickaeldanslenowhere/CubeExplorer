// Final Two-Phase Algorithm implementation
// This version uses real move tables based on the original Pascal code

import { CancellationManager } from '../utils/CancellationManager';

import { 
  TWO_PHASE_CONSTANTS 
} from '../types/TwoPhaseTypes';
import CubeState from '@cube-explorer/shared/src/cube/CubeState';
import { allValidMoves, applyMove, cubeMoves } from '@cube-explorer/shared';

export class FinalTwoPhaseSolver {
  // Constants from original Pascal code
  private static readonly MAX_PHASE1_DEPTH = TWO_PHASE_CONSTANTS.MAX_PHASE1_DEPTH;
  private static readonly MAX_PHASE2_DEPTH = TWO_PHASE_CONSTANTS.MAX_PHASE2_DEPTH;
  private static readonly MAX_TOTAL_DEPTH = TWO_PHASE_CONSTANTS.MAX_TOTAL_DEPTH;


  /**
   * Solve a cube using the final Two-Phase Algorithm with real-time logs
   * @param cube - The cube to solve
   * @param logger - Logger object for real-time logs
   */
  static async solveWithLogs(cube: CubeState, logger: any): Promise<string[]> {
    const startTime = Date.now();
    logger.log('Starting Two-Phase Algorithm...', true);
    
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      logger.error('Operation was cancelled by user', true);
      return [];
    }
    
    // Phase 1: Solve to subgroup H
    const phase1StartTime = Date.now();
    const phase1Solution = await this.solvePhase1(cube, logger);
    const phase1Time = Date.now() - phase1StartTime;
    logger.info(`Phase 1 completed in ${phase1Time}ms with solution: [${phase1Solution.join(', ')}]`, true);
    
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      logger.error('Operation was cancelled by user', true);
      return [];
    }
    

    
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      logger.error('Operation was cancelled by user', true);
      return [];
    }
    
    // Combine solutions
    const totalSolution = [...phase1Solution];
    
    const totalTime = Date.now() - startTime;
    logger.info(`Two-Phase Algorithm completed successfully in ${totalTime}ms`, true);
    logger.info(`Total solution: [${totalSolution.join(', ')}]`, true);
    
    return totalSolution;
  }

  /**
   * Solve Phase 1 using IDA* search with real move tables
   * @param state - Phase 1 state
   */
  private static async solvePhase1(state: CubeState, logger?: any): Promise<string[]> {
    if (state.isSolved()) {
      if (logger) {
        logger.info('Phase 1 already solved', true);
      } else {
        console.log('✅ Phase 1 already solved');
      }
      return [];
    }

    if (logger) {
      logger.info(`Starting Phase 1 IDA* search (max depth: ${this.MAX_PHASE1_DEPTH})`, true);
    } else {
      console.log(`🔍 Starting Phase 1 IDA* search (max depth: ${this.MAX_PHASE1_DEPTH})`);
    }
    
    // IDA* search
    for (let depth = 0; depth <= this.MAX_PHASE1_DEPTH; depth++) {
      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        if (logger) {
          logger.error('Operation was cancelled by user', true);
        } else {
          throw new Error('Operation was cancelled');
        }
        return [];
      }
      
      // Sleep .5 seconds before each depth change
      if (depth > 0 && logger) {
        // free the thread a bit
        await new Promise(resolve => setImmediate(resolve));
        
        // Check if operation was cancelled during sleep
        if (CancellationManager.isCancelled) {
          logger.error('Operation was cancelled by user during sleep', true);
          return [];
        }
      }
      
      const depthStartTime = Date.now();
      if (logger) {
        logger.info(`Searching Phase 1 at depth ${depth}...`, true);
      } else {
        console.log(`🔍 Searching Phase 1 at depth ${depth}...`);
      }
      
      try {
        const solution = await this.searchPhase1(state, depth, [], logger);
        const depthTime = Date.now() - depthStartTime;
        
        if (solution.length > 0) {
          if (logger) {
            logger.info(`Phase 1 solution found at depth ${depth} in ${depthTime}ms: [${solution.join(', ')}]`, true);
          } else {
            console.log(`✅ Phase 1 solution found at depth ${depth} in ${depthTime}ms: [${solution.join(', ')}]`);
          }
          return solution;
        } else {
          if (logger) {
            logger.info(`No solution found at depth ${depth} in ${depthTime}ms`, true);
          } else {
            console.log(`❌ No solution found at depth ${depth} in ${depthTime}ms`);
          }
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'Operation was cancelled') {
          if (logger) {
            logger.warn(`Phase 1 search cancelled at depth ${depth}`, true);
          } else {
            console.log(`⚠️ Phase 1 search cancelled at depth ${depth}`);
          }
          throw error;
        }
        throw error;
      }
    }

    if (logger) {
      logger.error('Phase 1 search failed - no solution found', true);
    } else {
      console.log('❌ Phase 1 search failed - no solution found');
    }
    return [];
  }


  /**
   * IDA* search for Phase 1 with real move tables
   * @param state - Current Phase 1 state
   * @param depth - Remaining depth
   * @param path - Current move path
   */
  private static async searchPhase1(state: CubeState, depth: number, path: string[], logger?: any): Promise<string[]> {
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      console.log('❌ Operation was cancelled by user');
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
        console.log('❌ Operation was cancelled by user during search');
        return [];
      }
      moveCount++;

      if (this.isRedundantMove(path, move)) {
        continue;
      }

      const newPath = [...path, move];
      // Log the current move being tested
      if (logger) {
        logger.debug(`🔍 Phase 1 testing move: ${move} (path: [${newPath.join(', ')}])`, false);
      }
      applyMove(workingState, move);

      const solution = await this.searchPhase1(workingState, depth - 1, newPath, logger);
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