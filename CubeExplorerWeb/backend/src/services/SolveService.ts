import { FinalTwoPhaseSolver } from './FinalTwoPhaseSolver';
import { CancellationManager } from '../utils/CancellationManager';
import { 
  CubieCube, 
  CornerCubie, 
  EdgeCubie, 
  CenterCubie
} from '../types/CubeTypes';
import { VALID_WCA_MOVES } from '../types/MoveTypes';
import { getMovePermutation, MovePermutation } from '../types/CubePermutations';

export class SolveService {
  /**
   * Solve a cube from a scramble string using the Two-Phase Algorithm
   * @param scramble - The scramble string (e.g., "R U F' D2 L' B")
   * @returns Object containing the resolution moves
   */
  static async solveCube(scramble: string): Promise<{ resolution: string; logs: string[] }> {
    const startTime = Date.now();
    const logs: string[] = [];
    
    const log = (message: string) => {
      console.log(message);
      logs.push(message);
    };
    
    log(`🔧 Starting cube solving for scramble: "${scramble}"`);
    
    try {
      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        throw new Error('Operation was cancelled');
      }

      // Validate the scramble
      const validationStartTime = Date.now();
      if (!this.isValidScramble(scramble)) {
        throw new Error('Invalid scramble format');
      }
      const validationTime = Date.now() - validationStartTime;
      log(`✅ Scramble validation completed in ${validationTime}ms`);

      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        throw new Error('Operation was cancelled');
      }

      // Convert scramble to cube state
      const conversionStartTime = Date.now();
      const cubeState = this.scrambleToCubeState(scramble);
      const conversionTime = Date.now() - conversionStartTime;
      log(`🧩 Scramble converted to cube state in ${conversionTime}ms`);
      
      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        log('❌ Operation was cancelled by user');
        return { resolution: 'Operation cancelled by user', logs };
      }
      
      // Use the Two-Phase Algorithm to solve the cube
      const solvingStartTime = Date.now();
      const solution = await FinalTwoPhaseSolver.solve(cubeState);
      const solvingTime = Date.now() - solvingStartTime;
      
      // Check if solution was cancelled (empty array)
      if (solution.length === 0) {
        log('❌ Operation was cancelled by user during solving');
        return { resolution: 'Operation cancelled by user', logs };
      }
      
      log(`🎯 Two-Phase Algorithm completed in ${solvingTime}ms with solution: [${solution.join(', ')}]`);
      
      // Convert solution array to string
      const resolution = solution.join(' ');
      
      const totalTime = Date.now() - startTime;
      log(`⏱️ Total solving time: ${totalTime}ms`);
      
      return {
        resolution: resolution || 'No solution found',
        logs
      };
    } catch (error) {
      const totalTime = Date.now() - startTime;
      const errorMessage = `❌ Error solving cube after ${totalTime}ms: ${error}`;
      console.error(errorMessage);
      logs.push(errorMessage);
      return {
        resolution: 'Error: Unable to solve cube',
        logs
      };
    }
  }

  /**
   * Solve a cube from a scramble string with real-time logs
   * @param scramble - The scramble string
   * @param sendLog - Function to send logs in real-time
   */
  static async solveCubeWithLogs(scramble: string, sendLog: (message: string) => void): Promise<{ resolution: string }> {
    const startTime = Date.now();
    sendLog(`🔧 Starting cube solving for scramble: "${scramble}"`);
    
    try {
      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        sendLog('❌ Operation was cancelled by user');
        return { resolution: 'Operation cancelled by user' };
      }
      
      // Validate the scramble
      const validationStartTime = Date.now();
      if (!this.isValidScramble(scramble)) {
        throw new Error('Invalid scramble format');
      }
      const validationTime = Date.now() - validationStartTime;
      sendLog(`✅ Scramble validation completed in ${validationTime}ms`);

      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        sendLog('❌ Operation was cancelled by user');
        return { resolution: 'Operation cancelled by user' };
      }

      // Convert scramble to cube state
      const conversionStartTime = Date.now();
      const cubeState = this.scrambleToCubeState(scramble);
      const conversionTime = Date.now() - conversionStartTime;
      sendLog(`🧩 Scramble converted to cube state in ${conversionTime}ms`);
      
      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        sendLog('❌ Operation was cancelled by user');
        return { resolution: 'Operation cancelled by user' };
      }
      
      // Use the Two-Phase Algorithm to solve the cube
      const solvingStartTime = Date.now();
      const solution = await FinalTwoPhaseSolver.solveWithLogs(cubeState, sendLog);
      const solvingTime = Date.now() - solvingStartTime;
      
      // Check if solution was cancelled (empty array)
      if (solution.length === 0) {
        sendLog('❌ Operation was cancelled by user during solving');
        return { resolution: 'Operation cancelled by user' };
      }
      
      sendLog(`🎯 Two-Phase Algorithm completed in ${solvingTime}ms with solution: [${solution.join(', ')}]`);
      
      // Convert solution array to string
      const resolution = solution.join(' ');
      
      const totalTime = Date.now() - startTime;
      sendLog(`⏱️ Total solving time: ${totalTime}ms`);
      
      return {
        resolution: resolution || 'No solution found'
      };
    } catch (error) {
      const totalTime = Date.now() - startTime;
      const errorMessage = `❌ Error solving cube after ${totalTime}ms: ${error}`;
      sendLog(errorMessage);
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
          console.log(`❌ Invalid scramble: consecutive moves on same face (${moves[i-1]} ${currentMove})`);
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
            console.log(`❌ Invalid scramble: three-move pattern on opposite faces (${moves[i-2]} ${moves[i-1]} ${currentMove})`);
            return false;
          }
        }
      }
    }
    
    return true;
  }

  /**
   * Convert a scramble string to a CubieCube state using correct permutations
   * @param scramble - The scramble string
   * @returns CubieCube state representing the scrambled cube
   */
  private static scrambleToCubeState(scramble: string): CubieCube {
    console.log(`🔄 Converting scramble to cube state: "${scramble}"`);
    
    // Start with a solved cube
    const solvedCube = this.createSolvedCube();
    
    // Parse and apply each move
    const moves = this.parseScramble(scramble);
    let currentCube = solvedCube;
    
    for (const move of moves) {
      currentCube = this.applyMoveToCubeCorrect(currentCube, move);
    }
    
    console.log(`✅ Scramble applied successfully with ${moves.length} moves`);
    return currentCube;
  }

  /**
   * Parse a scramble string into individual moves
   * @param scramble - The scramble string
   * @returns Array of individual moves
   */
  private static parseScramble(scramble: string): string[] {
    const moves = scramble.trim().split(/\s+/).filter(move => move.length > 0);
    const expandedMoves: string[] = [];
    
    moves.forEach(move => {
      // Check if it's a double move (e.g., U2, R2, F2, etc.)
      if (move.length === 2 && move[1] === '2') {
        const baseMove = move[0];
        // Expand U2 to U U, R2 to R R, etc.
        expandedMoves.push(baseMove, baseMove);
      } else {
        // Regular move (single or prime)
        expandedMoves.push(move);
      }
    });
    
    return expandedMoves;
  }


  /**
   * Create a solved cube state
   * @returns CubieCube in solved state
   */
  private static createSolvedCube(): CubieCube {
    return {
      corners: [
        { c: 'URF', o: 0 }, { c: 'UFL', o: 0 }, { c: 'ULB', o: 0 }, { c: 'UBR', o: 0 },
        { c: 'DFR', o: 0 }, { c: 'DLF', o: 0 }, { c: 'DBL', o: 0 }, { c: 'DRB', o: 0 }
      ],
      edges: [
        { e: 'UR', o: 0 }, { e: 'UF', o: 0 }, { e: 'UL', o: 0 }, { e: 'UB', o: 0 },
        { e: 'DR', o: 0 }, { e: 'DF', o: 0 }, { e: 'DL', o: 0 }, { e: 'DB', o: 0 },
        { e: 'FR', o: 0 }, { e: 'FL', o: 0 }, { e: 'BL', o: 0 }, { e: 'BR', o: 0 }
      ],
      centers: [
        { c: 'U', o: 0 }, { c: 'D', o: 0 }, { c: 'R', o: 0 },
        { c: 'L', o: 0 }, { c: 'F', o: 0 }, { c: 'B', o: 0 }
      ]
    };
  }

  /**
   * Apply a single move to a cube state
   * @param cube - The cube state
   * @param move - The move to apply (e.g., "R", "U'", "F2")
   * @returns New cube state after applying the move
   */
  private static applyMoveToCube(cube: CubieCube, move: string): CubieCube {
    // Clone the cube to avoid mutations
    const newCube = this.cloneCube(cube);
    
    // Apply the move based on its type
    const face = move[0];
    const modifier = move.slice(1);
    const repetitions = modifier === '2' ? 2 : (modifier === '\'' ? 3 : 1);
    
    // Apply the move the specified number of times
    for (let i = 0; i < repetitions; i++) {
      this.applySingleMove(newCube, face);
    }
    
    return newCube;
  }

  /**
   * Apply a move to a cube state using correct permutations from original project
   * @param cube - The cube state to modify
   * @param move - The move to apply (e.g., "R", "U'", "F2")
   * @returns New cube state after applying the move
   */
  private static applyMoveToCubeCorrect(cube: CubieCube, move: string): CubieCube {
    // Clone the cube to avoid mutations
    const newCube = this.cloneCube(cube);
    
    // Apply the move based on its type
    const face = move[0];
    const modifier = move.slice(1);
    const repetitions = modifier === '2' ? 2 : (modifier === '\'' ? 3 : 1);
    
    // Apply the move the specified number of times
    for (let i = 0; i < repetitions; i++) {
      this.applySingleMoveCorrect(newCube, face);
    }
    
    return newCube;
  }

  /**
   * Apply a single 90-degree move to a cube state
   * @param cube - The cube state
   * @param face - The face to turn (U, D, R, L, F, B)
   */
  private static applySingleMove(cube: CubieCube, face: string): void {
    switch (face) {
      case 'U':
        this.applyUMove(cube);
        break;
      case 'D':
        this.applyDMove(cube);
        break;
      case 'R':
        this.applyRMove(cube);
        break;
      case 'L':
        this.applyLMove(cube);
        break;
      case 'F':
        this.applyFMove(cube);
        break;
      case 'B':
        this.applyBMove(cube);
        break;
      case 'E':
        this.applyEMove(cube);
        break;
      case 'S':
        this.applySMove(cube);
        break;
      case 'M':
        this.applyMMove(cube);
        break;
      case 'x':
        this.applyXMove(cube);
        break;
      case 'y':
        this.applyYMove(cube);
        break;
      case 'z':
        this.applyZMove(cube);
        break;
    }
  }

  /**
   * Apply a single 90-degree move to a cube state using correct permutations
   * Based on the original Pascal project's FaceletMove array
   * @param cube - The cube state
   * @param face - The face to turn (U, D, R, L, F, B)
   */
  private static applySingleMoveCorrect(cube: CubieCube, face: string): void {
    switch (face) {
      case 'U':
        this.applyUMoveCorrect(cube);
        break;
      case 'D':
        this.applyDMoveCorrect(cube);
        break;
      case 'R':
        this.applyRMoveCorrect(cube);
        break;
      case 'L':
        this.applyLMoveCorrect(cube);
        break;
      case 'F':
        this.applyFMoveCorrect(cube);
        break;
      case 'B':
        this.applyBMoveCorrect(cube);
        break;
      case 'E':
        this.applyEMoveCorrect(cube);
        break;
      case 'S':
        this.applySMoveCorrect(cube);
        break;
      case 'M':
        this.applyMMoveCorrect(cube);
        break;
      case 'x':
        this.applyXMoveCorrect(cube);
        break;
      case 'y':
        this.applyYMoveCorrect(cube);
        break;
      case 'z':
        this.applyZMoveCorrect(cube);
        break;
    }
  }

  /**
   * Apply U move (simplified implementation)
   */
  private static applyUMove(cube: CubieCube): void {
    // Rotate top face corners
    const temp = cube.corners[0];
    cube.corners[0] = cube.corners[3];
    cube.corners[3] = cube.corners[2];
    cube.corners[2] = cube.corners[1];
    cube.corners[1] = temp;
    
    // Rotate top face edges
    const tempEdge = cube.edges[0];
    cube.edges[0] = cube.edges[3];
    cube.edges[3] = cube.edges[2];
    cube.edges[2] = cube.edges[1];
    cube.edges[1] = tempEdge;
  }

  /**
   * Apply D move (simplified implementation)
   */
  private static applyDMove(cube: CubieCube): void {
    // Rotate bottom face corners
    const temp = cube.corners[4];
    cube.corners[4] = cube.corners[7];
    cube.corners[7] = cube.corners[6];
    cube.corners[6] = cube.corners[5];
    cube.corners[5] = temp;
    
    // Rotate bottom face edges
    const tempEdge = cube.edges[4];
    cube.edges[4] = cube.edges[7];
    cube.edges[7] = cube.edges[6];
    cube.edges[6] = cube.edges[5];
    cube.edges[5] = tempEdge;
  }

  /**
   * Apply R move (simplified implementation)
   */
  private static applyRMove(cube: CubieCube): void {
    // Rotate right face corners
    const temp = cube.corners[0];
    cube.corners[0] = cube.corners[4];
    cube.corners[4] = cube.corners[7];
    cube.corners[7] = cube.corners[3];
    cube.corners[3] = temp;
    
    // Rotate right face edges
    const tempEdge = cube.edges[0];
    cube.edges[0] = cube.edges[8];
    cube.edges[8] = cube.edges[4];
    cube.edges[4] = cube.edges[11];
    cube.edges[11] = tempEdge;
  }

  /**
   * Apply L move (simplified implementation)
   */
  private static applyLMove(cube: CubieCube): void {
    // Rotate left face corners
    const temp = cube.corners[1];
    cube.corners[1] = cube.corners[2];
    cube.corners[2] = cube.corners[6];
    cube.corners[6] = cube.corners[5];
    cube.corners[5] = temp;
    
    // Rotate left face edges
    const tempEdge = cube.edges[2];
    cube.edges[2] = cube.edges[9];
    cube.edges[9] = cube.edges[6];
    cube.edges[6] = cube.edges[10];
    cube.edges[10] = tempEdge;
  }

  /**
   * Apply F move (simplified implementation)
   */
  private static applyFMove(cube: CubieCube): void {
    // Rotate front face corners
    const temp = cube.corners[0];
    cube.corners[0] = cube.corners[1];
    cube.corners[1] = cube.corners[5];
    cube.corners[5] = cube.corners[4];
    cube.corners[4] = temp;
    
    // Rotate front face edges
    const tempEdge = cube.edges[1];
    cube.edges[1] = cube.edges[8];
    cube.edges[8] = cube.edges[5];
    cube.edges[5] = cube.edges[9];
    cube.edges[9] = tempEdge;
  }

  /**
   * Apply B move (simplified implementation)
   */
  private static applyBMove(cube: CubieCube): void {
    // Rotate back face corners
    const temp = cube.corners[2];
    cube.corners[2] = cube.corners[3];
    cube.corners[3] = cube.corners[7];
    cube.corners[7] = cube.corners[6];
    cube.corners[6] = temp;
    
    // Rotate back face edges
    const tempEdge = cube.edges[3];
    cube.edges[3] = cube.edges[11];
    cube.edges[11] = cube.edges[7];
    cube.edges[7] = cube.edges[10];
    cube.edges[10] = tempEdge;
  }

  /**
   * Apply E move (simplified implementation)
   */
  private static applyEMove(cube: CubieCube): void {
    // Rotate equator slice
    const tempEdge = cube.edges[8];
    cube.edges[8] = cube.edges[9];
    cube.edges[9] = cube.edges[10];
    cube.edges[10] = cube.edges[11];
    cube.edges[11] = tempEdge;
  }

  /**
   * Apply S move (simplified implementation)
   */
  private static applySMove(cube: CubieCube): void {
    // Rotate standing slice
    const tempEdge = cube.edges[1];
    cube.edges[1] = cube.edges[6];
    cube.edges[6] = cube.edges[5];
    cube.edges[5] = cube.edges[2];
    cube.edges[2] = tempEdge;
  }

  /**
   * Apply M move (simplified implementation)
   */
  private static applyMMove(cube: CubieCube): void {
    // Rotate middle slice
    const tempEdge = cube.edges[0];
    cube.edges[0] = cube.edges[4];
    cube.edges[4] = cube.edges[7];
    cube.edges[7] = cube.edges[3];
    cube.edges[3] = tempEdge;
  }

  /**
   * Apply x rotation (simplified implementation)
   */
  private static applyXMove(cube: CubieCube): void {
    // Rotate entire cube around x-axis
    this.applyRMove(cube);
    this.applyLMove(cube);
    this.applyLMove(cube);
    this.applyLMove(cube);
  }

  /**
   * Apply y rotation (simplified implementation)
   */
  private static applyYMove(cube: CubieCube): void {
    // Rotate entire cube around y-axis
    this.applyUMove(cube);
    this.applyDMove(cube);
    this.applyDMove(cube);
    this.applyDMove(cube);
  }

  /**
   * Apply z rotation (simplified implementation)
   */
  private static applyZMove(cube: CubieCube): void {
    // Rotate entire cube around z-axis
    this.applyFMove(cube);
    this.applyBMove(cube);
    this.applyBMove(cube);
    this.applyBMove(cube);
  }

  /**
   * Clone a cube state
   * @param cube - The cube to clone
   * @returns Cloned cube state
   */
  private static cloneCube(cube: CubieCube): CubieCube {
    return {
      corners: cube.corners.map((corner: CornerCubie) => ({ c: corner.c, o: corner.o })),
      edges: cube.edges.map((edge: EdgeCubie) => ({ e: edge.e, o: edge.o })),
      centers: cube.centers.map((center: CenterCubie) => ({ c: center.c, o: center.o }))
    };
  }

  /**
   * Validate if a cube state is solvable
   * @param cubeState - The cube state to validate
   * @returns Boolean indicating if the state is solvable
   */
  static isSolvable(cubeState: any): boolean {
    // For now, assume all valid states are solvable
    // In a full implementation, this would check parity and other constraints
    return true;
  }

  /**
   * Get solving statistics for a cube state
   * @param cubeState - The cube state
   * @returns Object containing solving statistics
   */
  static getSolvingStats(cubeState: any): { estimatedMoves: number, difficulty: string } {
    // Simplified statistics based on the Two-Phase Algorithm
    return {
      estimatedMoves: 20, // Typical Two-Phase Algorithm solution length
      difficulty: 'Medium'
    };
  }

  // ============================================================================
  // CORRECT MOVE IMPLEMENTATIONS BASED ON ORIGINAL PASCAL PROJECT
  // ============================================================================

  /**
   * Apply U move using correct permutations from original project
   * Based on FaceletMove[U] from CubeDefs.pas
   */
  private static applyUMoveCorrect(cube: CubieCube): void {
    // U face: U3,U6,U9,U2,U5,U8,U1,U4,U7 (clockwise rotation)
    // Corners: URF->UBR->ULB->UFL->URF
    const tempCorner = cube.corners[0]; // URF
    cube.corners[0] = cube.corners[3]; // UBR
    cube.corners[3] = cube.corners[2]; // ULB  
    cube.corners[2] = cube.corners[1]; // UFL
    cube.corners[1] = tempCorner; // URF

    // Edges: UR->UB->UL->UF->UR
    const tempEdge = cube.edges[0]; // UR
    cube.edges[0] = cube.edges[3]; // UB
    cube.edges[3] = cube.edges[2]; // UL
    cube.edges[2] = cube.edges[1]; // UF
    cube.edges[1] = tempEdge; // UR
  }

  /**
   * Apply R move using correct permutations from frontend logic
   */
  private static applyRMoveCorrect(cube: CubieCube): void {
    // Use the correct permutation from frontend logic
    // R move: URF->DFR->DRB->UBR->URF (corners)
    //         UR->FR->DR->BR->UR (edges)
    
    // Corners: URF->DFR->DRB->UBR->URF
    const tempCorner = cube.corners[0]; // URF
    cube.corners[0] = cube.corners[4]; // DFR
    cube.corners[4] = cube.corners[7]; // DRB
    cube.corners[7] = cube.corners[3]; // UBR
    cube.corners[3] = tempCorner; // URF

    // Edges: UR->FR->DR->BR->UR
    const tempEdge = cube.edges[0]; // UR
    cube.edges[0] = cube.edges[8]; // FR
    cube.edges[8] = cube.edges[4]; // DR
    cube.edges[4] = cube.edges[11]; // BR
    cube.edges[11] = tempEdge; // UR
  }

  /**
   * Apply F move using correct permutations from original project
   * Based on FaceletMove[F] from CubeDefs.pas
   */
  private static applyFMoveCorrect(cube: CubieCube): void {
    // F face: F3,F6,F9,F2,F5,F8,F1,F4,F7 (clockwise rotation)
    // Corners: URF->UFL->DLF->DFR->URF
    const tempCorner = cube.corners[0]; // URF
    cube.corners[0] = cube.corners[1]; // UFL
    cube.corners[1] = cube.corners[5]; // DLF
    cube.corners[5] = cube.corners[4]; // DFR
    cube.corners[4] = tempCorner; // URF

    // Edges: UF->FL->DF->FR->UF
    const tempEdge = cube.edges[1]; // UF
    cube.edges[1] = cube.edges[9]; // FL
    cube.edges[9] = cube.edges[5]; // DF
    cube.edges[5] = cube.edges[8]; // FR
    cube.edges[8] = tempEdge; // UF
  }

  /**
   * Apply D move using correct permutations from original project
   * Based on FaceletMove[D] from CubeDefs.pas
   */
  private static applyDMoveCorrect(cube: CubieCube): void {
    // D face: D3,D6,D9,D2,D5,D8,D1,D4,D7 (clockwise rotation)
    // Corners: DFR->DLF->DBL->DRB->DFR
    const tempCorner = cube.corners[4]; // DFR
    cube.corners[4] = cube.corners[5]; // DLF
    cube.corners[5] = cube.corners[6]; // DBL
    cube.corners[6] = cube.corners[7]; // DRB
    cube.corners[7] = tempCorner; // DFR

    // Edges: DF->DL->DB->DR->DF
    const tempEdge = cube.edges[5]; // DF
    cube.edges[5] = cube.edges[6]; // DL
    cube.edges[6] = cube.edges[7]; // DB
    cube.edges[7] = cube.edges[4]; // DR
    cube.edges[4] = tempEdge; // DF
  }

  /**
   * Apply L move using correct permutations from original project
   * Based on FaceletMove[L] from CubeDefs.pas
   */
  private static applyLMoveCorrect(cube: CubieCube): void {
    // L face: L3,L6,L9,L2,L5,L8,L1,L4,L7 (clockwise rotation)
    // Corners: UFL->ULB->DBL->DLF->UFL
    const tempCorner = cube.corners[1]; // UFL
    cube.corners[1] = cube.corners[2]; // ULB
    cube.corners[2] = cube.corners[6]; // DBL
    cube.corners[6] = cube.corners[5]; // DLF
    cube.corners[5] = tempCorner; // UFL

    // Edges: UL->BL->DL->FL->UL
    const tempEdge = cube.edges[2]; // UL
    cube.edges[2] = cube.edges[10]; // BL
    cube.edges[10] = cube.edges[6]; // DL
    cube.edges[6] = cube.edges[9]; // FL
    cube.edges[9] = tempEdge; // UL
  }

  /**
   * Apply B move using correct permutations from original project
   * Based on FaceletMove[B] from CubeDefs.pas
   */
  private static applyBMoveCorrect(cube: CubieCube): void {
    // B face: B3,B6,B9,B2,B5,B8,B1,B4,B7 (clockwise rotation)
    // Corners: UBR->ULB->DBL->DRB->UBR
    const tempCorner = cube.corners[3]; // UBR
    cube.corners[3] = cube.corners[2]; // ULB
    cube.corners[2] = cube.corners[6]; // DBL
    cube.corners[6] = cube.corners[7]; // DRB
    cube.corners[7] = tempCorner; // UBR

    // Edges: UB->BL->DB->BR->UB
    const tempEdge = cube.edges[3]; // UB
    cube.edges[3] = cube.edges[10]; // BL
    cube.edges[10] = cube.edges[7]; // DB
    cube.edges[7] = cube.edges[11]; // BR
    cube.edges[11] = tempEdge; // UB
  }

  // Slice moves and rotations - simplified for now
  private static applyEMoveCorrect(cube: CubieCube): void {
    // E slice: middle layer horizontal
    this.applyEMove(cube);
  }

  private static applySMoveCorrect(cube: CubieCube): void {
    // S slice: middle layer vertical (front-back)
    this.applySMove(cube);
  }

  private static applyMMoveCorrect(cube: CubieCube): void {
    // M slice: middle layer vertical (left-right)
    this.applyMMove(cube);
  }

  private static applyXMoveCorrect(cube: CubieCube): void {
    // x rotation: whole cube around R axis
    this.applyXMove(cube);
  }

  private static applyYMoveCorrect(cube: CubieCube): void {
    // y rotation: whole cube around U axis
    this.applyYMove(cube);
  }

  private static applyZMoveCorrect(cube: CubieCube): void {
    // z rotation: whole cube around F axis
    this.applyZMove(cube);
  }
}
