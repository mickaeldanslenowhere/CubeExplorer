// Types for move tables and pruning tables

// Move table interface
export interface MoveTable {
  [key: number]: number;
}

// Pruning table interface
export interface PruningTable {
  [key: number]: number;
}

// Move table types
export interface MoveTables {
  twistMove: MoveTable;
  flipSliceMove: MoveTable;
  cornPermMove: MoveTable;
  udSliceSortedMove: MoveTable;
  edge8PermMove: MoveTable;
}

// Pruning table types
export interface PruningTables {
  phase1Pruning: PruningTable;
  phase2Pruning: PruningTable;
}

// Combined tables interface
export interface AllTables extends MoveTables, PruningTables {}
