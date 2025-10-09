// Move types for Rubik's Cube

// All possible moves in WCA notation
export type Move = 'U' | 'U2' | 'U\'' | 'R' | 'R2' | 'R\'' | 'F' | 'F2' | 'F\'' | 
            'D' | 'D2' | 'D\'' | 'L' | 'L2' | 'L\'' | 'B' | 'B2' | 'B\'' |
            'E' | 'E2' | 'E\'' | 'S' | 'S2' | 'S\'' | 'M' | 'M2' | 'M\'' |
            'x' | 'x2' | 'x\'' | 'y' | 'y2' | 'y\'' | 'z' | 'z2' | 'z\'';

// Face moves (basic turns)
export type FaceMove = 'U' | 'U2' | 'U\'' | 'R' | 'R2' | 'R\'' | 'F' | 'F2' | 'F\'' | 
                       'D' | 'D2' | 'D\'' | 'L' | 'L2' | 'L\'' | 'B' | 'B2' | 'B\'';

// Slice moves
export type SliceMove = 'E' | 'E2' | 'E\'' | 'S' | 'S2' | 'S\'' | 'M' | 'M2' | 'M\'';

// Cube rotations
export type CubeRotation = 'x' | 'x2' | 'x\'' | 'y' | 'y2' | 'y\'' | 'z' | 'z2' | 'z\'';

// Move arrays for different phases
export const PHASE1_MOVES: Move[] = [
  'U', 'U2', 'U\'', 'R', 'R2', 'R\'', 'F', 'F2', 'F\'',
  'D', 'D2', 'D\'', 'L', 'L2', 'L\'', 'B', 'B2', 'B\''
];

export const PHASE2_MOVES: Move[] = [
  'U', 'U2', 'U\'', 'R', 'R2', 'R\'', 'F', 'F2', 'F\'',
  'D', 'D2', 'D\'', 'L', 'L2', 'L\'', 'B', 'B2', 'B\'',
  'E', 'E2', 'E\'', 'S', 'S2', 'S\'', 'M', 'M2', 'M\''
];

// Move indices for table lookup (based on original Pascal Move enum)
export const MOVE_INDICES: { [key: string]: number } = {
  'U': 0, 'U2': 1, 'U\'': 2,
  'R': 3, 'R2': 4, 'R\'': 5,
  'F': 6, 'F2': 7, 'F\'': 8,
  'D': 9, 'D2': 10, 'D\'': 11,
  'L': 12, 'L2': 13, 'L\'': 14,
  'B': 15, 'B2': 16, 'B\'': 17,
  'E': 18, 'E2': 19, 'E\'': 20,
  'S': 21, 'S2': 22, 'S\'': 23,
  'M': 24, 'M2': 25, 'M\'': 26
};

// Valid WCA moves for validation
export const VALID_WCA_MOVES = [
  'R', 'U', 'F', 'D', 'L', 'B',           // Single turns
  'R\'', 'U\'', 'F\'', 'D\'', 'L\'', 'B\'', // Prime turns
  'R2', 'U2', 'F2', 'D2', 'L2', 'B2',     // Double turns
  'E', 'S', 'M',                           // Slice moves
  'E\'', 'S\'', 'M\'',                     // Prime slice moves
  'E2', 'S2', 'M2',                        // Double slice moves
  'x', 'y', 'z',                           // Cube rotations
  'x\'', 'y\'', 'z\'',                     // Prime cube rotations
  'x2', 'y2', 'z2'                         // Double cube rotations
];
