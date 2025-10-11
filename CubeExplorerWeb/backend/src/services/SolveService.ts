import { FinalTwoPhaseSolver } from './FinalTwoPhaseSolver';
import { CancellationManager } from '../utils/CancellationManager';
import { Logger } from '../utils/Logger';
import { VALID_WCA_MOVES } from '../types/MoveTypes';
import CubeState from '@cube-explorer/shared/src/cube/CubeState';
import { applyScramble } from '@cube-explorer/shared/src/cube/CubeMove';

export class SolveService {


  /**
   * Solve a cube from a scramble string with real-time logs
   * @param scramble - The scramble string
   */
  static async solveCubeWithLogs(scramble: string): Promise<{ resolution: string }> {
    const startTime = Date.now();
    Logger.log(`🔧 Starting cube solving for scramble: "${scramble}"`, { sendToFrontend: true });
    Logger.log(`🧪 Testing scramble: ${scramble}`);
    
    try {
      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        Logger.error('Operation was cancelled by user', { sendToFrontend: true });
        return { resolution: 'Operation cancelled by user' };
      }
      
      // Validate the scramble
      const validationStartTime = Date.now();
      if (!this.isValidScramble(scramble)) {
        throw new Error('Invalid scramble format');
      }
      const validationTime = Date.now() - validationStartTime;
      Logger.info(`Scramble validation completed in ${validationTime}ms`, { sendToFrontend: true });

      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        Logger.error('Operation was cancelled by user', { sendToFrontend: true });
        return { resolution: 'Operation cancelled by user' };
      }

      // Convert scramble to cube state
      const conversionStartTime = Date.now();


      Logger.log(`🔄 Converting scramble to cube state: "${scramble}"`);
    
      // Use the shared cube logic to get the scrambled cube state
      const cubeState = new CubeState();
      applyScramble(cubeState, scramble);
      Logger.log(`📊 Frontend cube state: ${cubeState.toString()}`);

      const conversionTime = Date.now() - conversionStartTime;
      Logger.info(`Scramble converted to cube state in ${conversionTime}ms`, { sendToFrontend: true });
      
      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        Logger.error('Operation was cancelled by user', { sendToFrontend: true });
        return { resolution: 'Operation cancelled by user' };
      }
      
      // Use the Two-Phase Algorithm to solve the cube
      const solvingStartTime = Date.now();
      const solution = await FinalTwoPhaseSolver.solveWithLogs(cubeState);
      const solvingTime = Date.now() - solvingStartTime;
      
      // Check if solution was cancelled (empty array)
      if (solution.length === 0) {
        Logger.error('Operation was cancelled by user during solving', { sendToFrontend: true });
        return { resolution: 'Operation cancelled by user' };
      }
      
      Logger.info(`Two-Phase Algorithm completed in ${solvingTime}ms with solution: [${solution.join(', ')}]`, { sendToFrontend: true });
      
      // Convert solution array to string
      const resolution = solution.join(' ');
      
      const totalTime = Date.now() - startTime;
      Logger.info(`Total solving time: ${totalTime}ms`, { sendToFrontend: true });
      
      return {
        resolution: resolution || 'No solution found'
      };
    } catch (error) {
      const totalTime = Date.now() - startTime;
      const errorMessage = `❌ Error solving cube after ${totalTime}ms: ${error}`;
      Logger.error(errorMessage, { sendToFrontend: true });
      return {
        resolution: 'Error: Unable to solve cube'
      };
    }
  }

  /**
   * Validate if a scramble string is valid according to WCA rules
   * @param scramble - The scramble string to validate
   * @returns Boolean indicating if the scramble is valid
   */
  static isValidScramble(scramble: string): boolean {
    if (!scramble || typeof scramble !== 'string') return false;
    
    // Split and validate each move
    const moves = scramble.trim().split(/\s+/);
    
    // Check if all moves are valid WCA moves
    if (!moves.every(move => VALID_WCA_MOVES.includes(move))) {
      return false;
    }
    
    // Check WCA scramble rules
    return this.isWCACompliant(moves);
  }

  /**
   * Check if a sequence of moves follows WCA scramble rules
   * @param moves - Array of moves to validate
   * @returns Boolean indicating if the sequence is WCA-compliant
   */
  private static isWCACompliant(moves: string[]): boolean {
    // Define opposite faces
    const oppositeFaces: { [key: string]: string } = {
      'U': 'D', 'D': 'U',
      'R': 'L', 'L': 'R', 
      'F': 'B', 'B': 'F'
    };
    
    for (let i = 0; i < moves.length; i++) {
      const currentMove = moves[i];
      const currentFace = currentMove[0];
      
      // Rule 1: No consecutive moves on same face
      if (i > 0) {
        const previousFace = moves[i - 1][0];
        if (currentFace === previousFace) {
          Logger.error(`❌ Invalid scramble: consecutive moves on same face (${moves[i-1]} ${currentMove})`);
          return false;
        }
      }
      
      // Rule 2: If last two moves were on opposite faces, 
      // don't allow either of those faces again (R L R' or R L L' is invalid)
      if (i > 1) {
        const twoMovesAgoFace = moves[i - 2][0];
        const previousFace = moves[i - 1][0];
        
        // Check if last two moves were on opposite faces
        if (previousFace === oppositeFaces[twoMovesAgoFace]) {
          // If so, current move cannot be on either of those faces
          if (currentFace === twoMovesAgoFace || currentFace === previousFace) {
            Logger.error(`❌ Invalid scramble: three-move pattern on opposite faces (${moves[i-2]} ${moves[i-1]} ${currentMove})`);
            return false;
          }
        }
      }
    }
    
    return true;
  }



}