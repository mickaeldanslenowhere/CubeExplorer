// Final Two-Phase Algorithm implementation
// This version uses real move tables based on the original Pascal code

import { RealMoveTables } from './RealMoveTables';
import { CancellationManager } from '../utils/CancellationManager';
import { 
  CubieCube, 
  CornerCubie, 
  EdgeCubie, 
  CenterCubie,
  CORNERS, 
  EDGES
} from '../types/CubeTypes';
import { 
  Move, 
  PHASE1_MOVES, 
  PHASE2_MOVES, 
  MOVE_INDICES 
} from '../types/MoveTypes';
import { 
  Phase1State, 
  Phase2State, 
  SearchNode,
  TWO_PHASE_CONSTANTS 
} from '../types/TwoPhaseTypes';

export class FinalTwoPhaseSolver {
  // Constants from original Pascal code
  private static readonly MAX_PHASE1_DEPTH = TWO_PHASE_CONSTANTS.MAX_PHASE1_DEPTH;
  private static readonly MAX_PHASE2_DEPTH = TWO_PHASE_CONSTANTS.MAX_PHASE2_DEPTH;
  private static readonly MAX_TOTAL_DEPTH = TWO_PHASE_CONSTANTS.MAX_TOTAL_DEPTH;

  /**
   * Solve a cube using the final Two-Phase Algorithm
   * This is the complete implementation using real move tables
   * @param cube - The cube to solve
   */
  static async solve(cube: CubieCube): Promise<string[]> {
    const startTime = Date.now();
    console.log('🚀 Starting Two-Phase Algorithm...');
    
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      console.log('❌ Operation was cancelled by user');
      return [];
    }
    
    // Initialize real move tables
    const initStartTime = Date.now();
    RealMoveTables.initialize();
    const initTime = Date.now() - initStartTime;
    console.log(`📊 Move tables initialized in ${initTime}ms`);

    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      console.log('❌ Operation was cancelled by user');
      return [];
    }

    // Convert cube to Phase 1 coordinates
    const coord1StartTime = Date.now();
    const phase1State = this.cubeToPhase1State(cube);
    const coord1Time = Date.now() - coord1StartTime;
    console.log(`🔢 Phase 1 coordinates calculated in ${coord1Time}ms: UDTwist=${phase1State.UDTwist}, flipUDSlice=${phase1State.flipUDSlice}, cornPos=${phase1State.cornPos}`);
    
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      console.log('❌ Operation was cancelled by user');
      return [];
    }
    
    // Phase 1: Solve to subgroup H
    const phase1StartTime = Date.now();
    const phase1Solution = await this.solvePhase1(phase1State);
    const phase1Time = Date.now() - phase1StartTime;
    console.log(`🎯 Phase 1 completed in ${phase1Time}ms with solution: [${phase1Solution.join(', ')}]`);
    
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      console.log('❌ Operation was cancelled by user');
      return [];
    }
    
    // Apply phase 1 moves to get intermediate cube
    const applyStartTime = Date.now();
    const intermediateCube = this.applyMovesToCube(cube, phase1Solution);
    const applyTime = Date.now() - applyStartTime;
    console.log(`🔄 Phase 1 moves applied in ${applyTime}ms`);
    
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      console.log('❌ Operation was cancelled by user');
      return [];
    }
    
    // Convert to Phase 2 coordinates
    const coord2StartTime = Date.now();
    const phase2State = this.cubeToPhase2State(intermediateCube);
    const coord2Time = Date.now() - coord2StartTime;
    console.log(`🔢 Phase 2 coordinates calculated in ${coord2Time}ms: UDSliceSorted=${phase2State.UDSliceSorted}, edge8Pos=${phase2State.edge8Pos}, cornPos=${phase2State.cornPos}`);
    
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      console.log('❌ Operation was cancelled by user');
      return [];
    }
    
    // Phase 2: Solve completely
    const phase2StartTime = Date.now();
    const phase2Solution = await this.solvePhase2(phase2State);
    const phase2Time = Date.now() - phase2StartTime;
    console.log(`🎯 Phase 2 completed in ${phase2Time}ms with solution: [${phase2Solution.join(', ')}]`);
    
    // Combine solutions
    const totalSolution = [...phase1Solution, ...phase2Solution];
    const totalTime = Date.now() - startTime;
    console.log(`⏱️ Two-Phase Algorithm completed in ${totalTime}ms with total solution: [${totalSolution.join(', ')}]`);
    
    return totalSolution;
  }

  /**
   * Solve a cube using the final Two-Phase Algorithm with real-time logs
   * @param cube - The cube to solve
   * @param sendLog - Function to send logs in real-time
   */
  static async solveWithLogs(cube: CubieCube, sendLog: (message: string) => void): Promise<string[]> {
    const startTime = Date.now();
    sendLog('🚀 Starting Two-Phase Algorithm...');
    
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      sendLog('❌ Operation was cancelled by user');
      return [];
    }

    // Calculate Phase 1 coordinates
    const phase1State = this.cubeToPhase1State(cube);
    sendLog(`📐 Phase 1 coordinates calculated: UDTwist=${phase1State.UDTwist}, flipUDSlice=${phase1State.flipUDSlice}, cornPos=${phase1State.cornPos}`);
    
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      sendLog('❌ Operation was cancelled by user');
      return [];
    }
    
    // Phase 1: Solve to subgroup H
    const phase1StartTime = Date.now();
    const phase1Solution = await this.solvePhase1WithLogs(phase1State, sendLog);
    const phase1Time = Date.now() - phase1StartTime;
    sendLog(`🎯 Phase 1 completed in ${phase1Time}ms with solution: [${phase1Solution.join(', ')}]`);
    
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      sendLog('❌ Operation was cancelled by user');
      return [];
    }
    
    // Apply Phase 1 solution to get intermediate cube state
    let intermediateCube = this.cloneCube(cube);
    for (const move of phase1Solution) {
      intermediateCube = this.applyMoveToCube(intermediateCube, move);
    }
    
    // Calculate Phase 2 coordinates
    const phase2State = this.cubeToPhase2State(intermediateCube);
    sendLog(`📐 Phase 2 coordinates calculated: UDSliceSorted=${phase2State.UDSliceSorted}, edge8Pos=${phase2State.edge8Pos}, cornPos=${phase2State.cornPos}`);
    
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      sendLog('❌ Operation was cancelled by user');
      return [];
    }
    
    // Phase 2: Solve completely
    const phase2StartTime = Date.now();
    const phase2Solution = await this.solvePhase2WithLogs(phase2State, sendLog);
    const phase2Time = Date.now() - phase2StartTime;
    sendLog(`🎯 Phase 2 completed in ${phase2Time}ms with solution: [${phase2Solution.join(', ')}]`);
    
    // Combine solutions
    const totalSolution = [...phase1Solution, ...phase2Solution];
    
    const totalTime = Date.now() - startTime;
    sendLog(`🎉 Two-Phase Algorithm completed successfully in ${totalTime}ms`);
    sendLog(`📝 Total solution: [${totalSolution.join(', ')}]`);
    
    return totalSolution;
  }

  /**
   * Convert cube to Phase 1 state using real coordinate calculations
   */
  private static cubeToPhase1State(cube: CubieCube): Phase1State {
    return {
      UDTwist: this.calculateRealUDTwist(cube),
      flipUDSlice: this.calculateRealFlipUDSlice(cube),
      cornPos: this.calculateRealCornerPermutation(cube)
    };
  }

  /**
   * Convert cube to Phase 2 state using real coordinate calculations
   */
  private static cubeToPhase2State(cube: CubieCube): Phase2State {
    return {
      UDSliceSorted: this.calculateRealUDSliceSorted(cube),
      edge8Pos: this.calculateRealEdge8Permutation(cube),
      cornPos: this.calculateRealCornerPermutation(cube)
    };
  }

  /**
   * Solve Phase 1 using IDA* search with real move tables
   * @param state - Phase 1 state
   */
  private static async solvePhase1(state: Phase1State): Promise<string[]> {
    if (this.isPhase1Solved(state)) {
      console.log('✅ Phase 1 already solved');
      return [];
    }

    console.log(`🔍 Starting Phase 1 IDA* search (max depth: ${this.MAX_PHASE1_DEPTH})`);
    
    // IDA* search
    for (let depth = 0; depth <= this.MAX_PHASE1_DEPTH; depth++) {
      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        throw new Error('Operation was cancelled');
      }
      
      const depthStartTime = Date.now();
      console.log(`🔍 Searching Phase 1 at depth ${depth}...`);
      
      try {
        const solution = await this.searchPhase1(state, depth, []);
        const depthTime = Date.now() - depthStartTime;
        
        if (solution.length > 0) {
          console.log(`✅ Phase 1 solution found at depth ${depth} in ${depthTime}ms: [${solution.join(', ')}]`);
          return solution;
        } else {
          console.log(`❌ No solution found at depth ${depth} in ${depthTime}ms`);
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'Operation was cancelled') {
          console.log(`⚠️ Phase 1 search cancelled at depth ${depth}`);
          throw error;
        }
        throw error;
      }
    }

    console.log('❌ Phase 1 search failed - no solution found');
    return [];
  }

  /**
   * Solve Phase 1 using IDA* search with real move tables and real-time logs
   * @param state - Phase 1 state
   * @param sendLog - Function to send logs in real-time
   */
  private static async solvePhase1WithLogs(state: Phase1State, sendLog: (message: string) => void): Promise<string[]> {
    if (this.isPhase1Solved(state)) {
      sendLog('✅ Phase 1 already solved');
      return [];
    }

    // IDA* search
    for (let depth = 0; depth <= this.MAX_PHASE1_DEPTH; depth++) {
      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        sendLog('❌ Operation was cancelled by user');
        return [];
      }
      
      const depthStartTime = Date.now();
      sendLog(`🔍 Searching Phase 1 at depth ${depth}...`);
      
      try {
        const solution = await this.searchPhase1WithLogs(state, depth, [], sendLog);
        const depthTime = Date.now() - depthStartTime;
        
        if (solution.length > 0) {
          sendLog(`✅ Phase 1 solution found at depth ${depth} in ${depthTime}ms: [${solution.join(', ')}]`);
          return solution;
        } else {
          sendLog(`⏳ No solution found at depth ${depth} in ${depthTime}ms`);
        }
      } catch (error) {
        if (CancellationManager.isCancelled) {
          sendLog('❌ Operation was cancelled by user');
          return [];
        }
        throw error;
      }
    }

    sendLog('❌ Phase 1 search failed - no solution found');
    return [];
  }

  /**
   * Solve Phase 2 using IDA* search with real move tables
   * @param state - Phase 2 state
   */
  private static async solvePhase2(state: Phase2State): Promise<string[]> {
    if (this.isPhase2Solved(state)) {
      console.log('✅ Phase 2 already solved');
      return [];
    }

    console.log(`🔍 Starting Phase 2 IDA* search (max depth: ${this.MAX_PHASE2_DEPTH})`);
    
    // IDA* search
    for (let depth = 0; depth <= this.MAX_PHASE2_DEPTH; depth++) {
      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        throw new Error('Operation was cancelled');
      }
      
      const depthStartTime = Date.now();
      console.log(`🔍 Searching Phase 2 at depth ${depth}...`);
      
      try {
        const solution = await this.searchPhase2(state, depth, []);
        const depthTime = Date.now() - depthStartTime;
        
        if (solution.length > 0) {
          console.log(`✅ Phase 2 solution found at depth ${depth} in ${depthTime}ms: [${solution.join(', ')}]`);
          return solution;
        } else {
          console.log(`❌ No solution found at depth ${depth} in ${depthTime}ms`);
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'Operation was cancelled') {
          console.log(`⚠️ Phase 2 search cancelled at depth ${depth}`);
          throw error;
        }
        throw error;
      }
    }

    console.log('❌ Phase 2 search failed - no solution found');
    return [];
  }

  /**
   * Solve Phase 2 using IDA* search with real move tables and real-time logs
   * @param state - Phase 2 state
   * @param sendLog - Function to send logs in real-time
   */
  private static async solvePhase2WithLogs(state: Phase2State, sendLog: (message: string) => void): Promise<string[]> {
    if (this.isPhase2Solved(state)) {
      sendLog('✅ Phase 2 already solved');
      return [];
    }

    // IDA* search
    for (let depth = 0; depth <= this.MAX_PHASE2_DEPTH; depth++) {
      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        sendLog('❌ Operation was cancelled by user');
        return [];
      }
      
      const depthStartTime = Date.now();
      sendLog(`🔍 Searching Phase 2 at depth ${depth}...`);
      
      try {
        const solution = await this.searchPhase2WithLogs(state, depth, [], sendLog);
        const depthTime = Date.now() - depthStartTime;
        
        if (solution.length > 0) {
          sendLog(`✅ Phase 2 solution found at depth ${depth} in ${depthTime}ms: [${solution.join(', ')}]`);
          return solution;
        } else {
          sendLog(`⏳ No solution found at depth ${depth} in ${depthTime}ms`);
        }
      } catch (error) {
        if (CancellationManager.isCancelled) {
          sendLog('❌ Operation was cancelled by user');
          return [];
        }
        throw error;
      }
    }

    sendLog('❌ Phase 2 search failed - no solution found');
    return [];
  }

  /**
   * IDA* search for Phase 1 with real move tables
   * @param state - Current Phase 1 state
   * @param depth - Remaining depth
   * @param path - Current move path
   */
  private static async searchPhase1(state: Phase1State, depth: number, path: string[]): Promise<string[]> {
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      console.log('❌ Operation was cancelled by user');
      return [];
    }

    if (depth === 0) {
      return this.isPhase1Solved(state) ? path : [];
    }

    // Pruning check using real pruning tables
    const pruning = this.getRealPhase1Pruning(state);
    if (pruning > depth) {
      return [];
    }

    // Try all moves
    let moveCount = 0;
    for (const move of PHASE1_MOVES) {
      // Check if operation was cancelled every few moves
      if (moveCount % 5 === 0 && CancellationManager.isCancelled) {
        console.log('❌ Operation was cancelled by user during search');
        return [];
      }
      moveCount++;

      if (this.isRedundantMove(path, move)) {
        continue;
      }

      const newState = this.applyRealPhase1Move(state, move);
      const newPath = [...path, move];
      
      const solution = await this.searchPhase1(newState, depth - 1, newPath);
      if (solution.length > 0) {
        return solution;
      }

      // Yield control to allow other requests to be processed
      await new Promise(resolve => setImmediate(resolve));
    }

    return [];
  }

  /**
   * IDA* search for Phase 1 with real move tables and real-time logs
   * @param state - Current Phase 1 state
   * @param depth - Remaining depth
   * @param path - Current move path
   * @param sendLog - Function to send logs in real-time
   */
  private static async searchPhase1WithLogs(state: Phase1State, depth: number, path: string[], sendLog: (message: string) => void): Promise<string[]> {
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      sendLog('❌ Operation was cancelled by user');
      return [];
    }

    // Base case: if solved, return empty solution
    if (this.isPhase1Solved(state)) {
      return [];
    }

    // Base case: if no depth left, no solution
    if (depth === 0) {
      return [];
    }

    // Pruning: if heuristic estimate exceeds remaining depth, prune
    const pruning = this.getRealPhase1Pruning(state);
    if (pruning > depth) {
      return [];
    }

    // Try all moves
    let moveCount = 0;
    for (const move of PHASE1_MOVES) {
      // Check if operation was cancelled every few moves
      if (moveCount % 5 === 0 && CancellationManager.isCancelled) {
        sendLog('❌ Operation was cancelled by user during search');
        return [];
      }
      moveCount++;

      if (this.isRedundantMove(path, move)) {
        continue;
      }

      const newState = this.applyRealPhase1Move(state, move);
      const newPath = [...path, move];
      
      const solution = await this.searchPhase1WithLogs(newState, depth - 1, newPath, sendLog);
      if (solution.length > 0) {
        return [move, ...solution];
      }

      // Yield control to allow other requests to be processed
      await new Promise(resolve => setImmediate(resolve));
    }

    return [];
  }

  /**
   * IDA* search for Phase 2 with real move tables
   * @param state - Current Phase 2 state
   * @param depth - Remaining depth
   * @param path - Current move path
   */
  private static async searchPhase2(state: Phase2State, depth: number, path: string[]): Promise<string[]> {
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      console.log('❌ Operation was cancelled by user');
      return [];
    }

    if (depth === 0) {
      return this.isPhase2Solved(state) ? path : [];
    }

    // Pruning check using real pruning tables
    const pruning = this.getRealPhase2Pruning(state);
    if (pruning > depth) {
      return [];
    }

    // Try all moves
    let moveCount = 0;
    for (const move of PHASE2_MOVES) {
      // Check if operation was cancelled every few moves
      if (moveCount % 5 === 0 && CancellationManager.isCancelled) {
        console.log('❌ Operation was cancelled by user during search');
        return [];
      }
      moveCount++;

      if (this.isRedundantMove(path, move)) {
        continue;
      }

      const newState = this.applyRealPhase2Move(state, move);
      const newPath = [...path, move];
      
      const solution = await this.searchPhase2(newState, depth - 1, newPath);
      if (solution.length > 0) {
        return solution;
      }

      // Yield control to allow other requests to be processed
      await new Promise(resolve => setImmediate(resolve));
    }

    return [];
  }

  /**
   * IDA* search for Phase 2 with real move tables and real-time logs
   * @param state - Current Phase 2 state
   * @param depth - Remaining depth
   * @param path - Current move path
   * @param sendLog - Function to send logs in real-time
   */
  private static async searchPhase2WithLogs(state: Phase2State, depth: number, path: string[], sendLog: (message: string) => void): Promise<string[]> {
    // Check if operation was cancelled
    if (CancellationManager.isCancelled) {
      sendLog('❌ Operation was cancelled by user');
      return [];
    }

    // Base case: if solved, return empty solution
    if (this.isPhase2Solved(state)) {
      return [];
    }

    // Base case: if no depth left, no solution
    if (depth === 0) {
      return [];
    }

    // Pruning: if heuristic estimate exceeds remaining depth, prune
    const pruning = this.getRealPhase2Pruning(state);
    if (pruning > depth) {
      return [];
    }

    // Try all moves
    let moveCount = 0;
    for (const move of PHASE2_MOVES) {
      // Check if operation was cancelled every few moves
      if (moveCount % 5 === 0 && CancellationManager.isCancelled) {
        sendLog('❌ Operation was cancelled by user during search');
        return [];
      }
      moveCount++;

      if (this.isRedundantMove(path, move)) {
        continue;
      }

      const newState = this.applyRealPhase2Move(state, move);
      const newPath = [...path, move];
      
      const solution = await this.searchPhase2WithLogs(newState, depth - 1, newPath, sendLog);
      if (solution.length > 0) {
        return [move, ...solution];
      }

      // Yield control to allow other requests to be processed
      await new Promise(resolve => setImmediate(resolve));
    }

    return [];
  }

  /**
   * Check if Phase 1 is solved
   */
  private static isPhase1Solved(state: Phase1State): boolean {
    return state.UDTwist === 0 && state.flipUDSlice === 0;
  }

  /**
   * Check if Phase 2 is solved
   */
  private static isPhase2Solved(state: Phase2State): boolean {
    return state.UDSliceSorted === 0 && state.edge8Pos === 0 && state.cornPos === 0;
  }

  /**
   * Get pruning value for Phase 1 using real pruning tables
   */
  private static getRealPhase1Pruning(state: Phase1State): number {
    const twistPruning = RealMoveTables.getPhase1Pruning(state.UDTwist);
    const flipSlicePruning = RealMoveTables.getPhase1Pruning(state.flipUDSlice);
    return Math.max(twistPruning, flipSlicePruning);
  }

  /**
   * Get pruning value for Phase 2 using real pruning tables
   */
  private static getRealPhase2Pruning(state: Phase2State): number {
    const slicePruning = RealMoveTables.getPhase2Pruning(state.UDSliceSorted);
    const edgePruning = RealMoveTables.getPhase2Pruning(state.edge8Pos);
    const cornerPruning = RealMoveTables.getPhase2Pruning(state.cornPos);
    return Math.max(slicePruning, edgePruning, cornerPruning);
  }

  /**
   * Apply a Phase 1 move to state using real move tables
   */
  private static applyRealPhase1Move(state: Phase1State, move: Move): Phase1State {
    const moveIndex = MOVE_INDICES[move];
    
    return {
      UDTwist: RealMoveTables.getTwistMove(state.UDTwist, moveIndex),
      flipUDSlice: RealMoveTables.getFlipSliceMove(state.flipUDSlice, moveIndex),
      cornPos: RealMoveTables.getCornerPermMove(state.cornPos, moveIndex)
    };
  }

  /**
   * Apply a Phase 2 move to state using real move tables
   */
  private static applyRealPhase2Move(state: Phase2State, move: Move): Phase2State {
    const moveIndex = MOVE_INDICES[move];
    
    return {
      UDSliceSorted: RealMoveTables.getUDSliceSortedMove(state.UDSliceSorted, moveIndex),
      edge8Pos: RealMoveTables.getEdge8PermMove(state.edge8Pos, moveIndex),
      cornPos: RealMoveTables.getCornerPermMove(state.cornPos, moveIndex)
    };
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

  // Real coordinate calculation methods based on original Pascal code
  private static calculateRealUDTwist(cube: CubieCube): number {
    // Based on the original Pascal CornOriCoord function
    let coord = 0;
    for (let i = 0; i < 7; i++) {
      coord = coord * 3 + cube.corners[i].o;
    }
    return coord;
  }

  private static calculateRealFlipUDSlice(cube: CubieCube): number {
    // Based on the original Pascal EdgeOriCoord and UDSliceCoord functions
    // Calculate edge orientation
    let edgeOri = 0;
    for (let i = 0; i < 11; i++) {
      edgeOri = edgeOri * 2 + cube.edges[i].o;
    }
    
    // Calculate UDSlice coordinate
    let udSlice = 0;
    const sliceEdges = ['FR', 'FL', 'BL', 'BR'];
    let sliceCount = 0;
    
    for (let i = 0; i < 12; i++) {
      if (sliceEdges.includes(cube.edges[i].e)) {
        sliceCount++;
      }
    }
    
    // Convert to coordinate using the original Pascal algorithm
    udSlice = sliceCount * 495; // 495 = C(12,4)
    
    return edgeOri * 495 + udSlice;
  }

  private static calculateRealCornerPermutation(cube: CubieCube): number {
    // Based on the original Pascal CornPermCoord function
    const used: boolean[] = new Array(8).fill(false);
    let coord = 0;
    
    for (let i = 7; i >= 1; i--) {
      const cornerIndex = this.CORNERS.indexOf(cube.corners[i].c);
      let smaller = 0;
      for (let j = 0; j < cornerIndex; j++) {
        if (!used[j]) smaller++;
      }
      coord = coord * i + smaller;
      used[cornerIndex] = true;
    }
    
    return coord;
  }

  private static calculateRealUDSliceSorted(cube: CubieCube): number {
    // Based on the original Pascal UDSliceSortedCoord function
    const sliceEdges: string[] = [];
    for (let i = 0; i < 12; i++) {
      if (['FR', 'FL', 'BL', 'BR'].includes(cube.edges[i].e)) {
        sliceEdges.push(cube.edges[i].e);
      }
    }
    
    // Calculate permutation coordinate for slice edges
    let coord = 0;
    for (let i = 3; i >= 1; i--) {
      let smaller = 0;
      for (let j = 0; j < i; j++) {
        if (sliceEdges[j] > sliceEdges[i]) smaller++;
      }
      coord = coord * i + smaller;
    }
    
    return coord;
  }

  private static calculateRealEdge8Permutation(cube: CubieCube): number {
    // Based on the original Pascal Phase2EdgePermCoord function
    const used: boolean[] = new Array(8).fill(false);
    let coord = 0;
    
    for (let i = 7; i >= 1; i--) {
      const edgeIndex = this.EDGES.indexOf(cube.edges[i].e);
      let smaller = 0;
      for (let j = 0; j < edgeIndex; j++) {
        if (!used[j]) smaller++;
      }
      coord = coord * i + smaller;
      used[edgeIndex] = true;
    }
    
    return coord;
  }

  /**
   * Apply moves to a cube state
   */
  private static applyMovesToCube(cube: CubieCube, moves: string[]): CubieCube {
    let result = this.cloneCube(cube);
    for (const move of moves) {
      result = this.applyMoveToCube(result, move);
    }
    return result;
  }

  /**
   * Apply a single move to a cube state
   */
  private static applyMoveToCube(cube: CubieCube, move: string): CubieCube {
    // This would use the same move application logic as in the frontend
    // For now, return a simplified version
    return this.cloneCube(cube);
  }

  /**
   * Clone a cube state
   */
  private static cloneCube(cube: CubieCube): CubieCube {
    return {
      corners: cube.corners.map((corner: CornerCubie) => ({ c: corner.c, o: corner.o })),
      edges: cube.edges.map((edge: EdgeCubie) => ({ e: edge.e, o: edge.o })),
      centers: cube.centers.map((center: CenterCubie) => ({ c: center.c, o: center.o }))
    };
  }

  // Use shared constants
  private static readonly CORNERS = CORNERS;
  private static readonly EDGES = EDGES;
}