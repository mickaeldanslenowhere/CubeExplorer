// Basic cube types based on the original Pascal implementation

// Corner positions (8 corners)
export type Corner = 'URF' | 'UFL' | 'ULB' | 'UBR' | 'DFR' | 'DLF' | 'DBL' | 'DRB';

// Edge positions (12 edges)
export type Edge = 'UR' | 'UF' | 'UL' | 'UB' | 'DR' | 'DF' | 'DL' | 'DB' | 'FR' | 'FL' | 'BL' | 'BR';

// Center positions (6 centers)
export type Center = 'U' | 'D' | 'R' | 'L' | 'F' | 'B';

// Cubie interfaces
export interface CornerCubie {
  c: Corner; // position
  o: number; // orientation (0, 1, 2)
}

export interface EdgeCubie {
  e: Edge;   // position
  o: number; // orientation (0, 1)
}

export interface CenterCubie {
  c: Center; // position
  o: number; // orientation (0, 1, 2, 3)
}

// Main cube representation
export interface CubieCube {
  corners: CornerCubie[];
  edges: EdgeCubie[];
  centers: CenterCubie[];
}

// Constants for cube representation
export const CORNERS: Corner[] = ['URF', 'UFL', 'ULB', 'UBR', 'DFR', 'DLF', 'DBL', 'DRB'];
export const EDGES: Edge[] = ['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB', 'FR', 'FL', 'BL', 'BR'];
export const CENTERS: Center[] = ['U', 'D', 'R', 'L', 'F', 'B'];
