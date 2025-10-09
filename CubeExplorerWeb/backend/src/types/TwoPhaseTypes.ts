// Types for Two-Phase Algorithm implementation

// Phase 1 coordinates
export interface Phase1State {
  UDTwist: number;        // Corner orientation (0-2186)
  flipUDSlice: number;    // Edge orientation + UDSlice (0-64429)
  cornPos: number;        // Corner permutation (0-40319)
}

// Phase 2 coordinates
export interface Phase2State {
  UDSliceSorted: number;  // UDSlice sorted coordinate (0-11879)
  edge8Pos: number;       // Phase 2 edge permutation (0-40319)
  cornPos: number;        // Corner permutation (0-40319)
}

// Search node for IDA* algorithm
export interface SearchNode {
  state: Phase1State | Phase2State;
  depth: number;
  path: string[];
  phase: 1 | 2;
}

// Constants for Two-Phase Algorithm
export const TWO_PHASE_CONSTANTS = {
  MAX_PHASE1_DEPTH: 12,
  MAX_PHASE2_DEPTH: 18,
  MAX_TOTAL_DEPTH: 30,
  
  // Coordinate ranges
  CORNER_PERM_RANGE: 40320,    // 8! = 40320 possible corner permutations
  CORNER_ORI_RANGE: 2187,      // 3^7 = 2187 possible corner orientations
  EDGE_PERM_RANGE_HIGH: 22275, // High part of edge permutation
  EDGE_PERM_RANGE_LOW: 21504,  // Low part of edge permutation
  EDGE_ORI_RANGE: 2048,        // 2^11 = 2048 possible edge orientations
  CENTER_ORI_RANGE: 4096       // 4^6 = 4096 possible center orientations
} as const;
