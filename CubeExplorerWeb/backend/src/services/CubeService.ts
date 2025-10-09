import { SolveService } from './SolveService';
import { ScrambleService } from './ScrambleService';
import { ValidationService } from './ValidationService';
import { AlgorithmService } from './AlgorithmService';

/**
 * Main service class that acts as a facade for all cube-related operations
 */
export class CubeService {
  /**
   * Solve a cube from a scramble string
   * @param scramble - The scramble string (e.g., "R U F' D2 L' B")
   * @returns Object containing the resolution moves
   */
  static async solveCube(scramble: string): Promise<{ resolution: string }> {
    return SolveService.solveCube(scramble);
  }

  /**
   * Solve a cube from a scramble string with real-time logs
   * @param scramble - The scramble string
   * @param sendLog - Function to send logs in real-time
   */
  static async solveCubeWithLogs(scramble: string, sendLog: (message: string) => void): Promise<{ resolution: string }> {
    return SolveService.solveCubeWithLogs(scramble, sendLog);
  }

  /**
   * Generate a WCA-approved scramble
   * @returns Object containing the scramble moves
   */
  static async generateScramble(): Promise<{ scramble: string }> {
    return ScrambleService.generateScramble();
  }

  /**
   * Validate a cube state
   * @param cubeState - The cube state to validate
   * @returns Boolean indicating if the state is valid
   */
  static validateCubeState(cubeState: any): boolean {
    return ValidationService.validateCubeState(cubeState);
  }

  /**
   * Get available solving algorithms
   * @returns Object containing available algorithms
   */
  static getAlgorithms(): { methods: string[], algorithms: any } {
    return AlgorithmService.getAlgorithms();
  }

  // Additional convenience methods that delegate to specialized services

  /**
   * Check if a cube state is solvable
   * @param cubeState - The cube state to check
   * @returns Boolean indicating if the state is solvable
   */
  static isSolvable(cubeState: any): boolean {
    return SolveService.isSolvable(cubeState);
  }

  /**
   * Validate a scramble string
   * @param scramble - The scramble to validate
   * @returns Boolean indicating if the scramble is valid
   */
  static validateScramble(scramble: string): boolean {
    return ScrambleService.validateScramble(scramble);
  }

  /**
   * Validate a move
   * @param move - The move to validate
   * @returns Boolean indicating if the move is valid
   */
  static validateMove(move: string): boolean {
    return ValidationService.validateMove(move);
  }
}
