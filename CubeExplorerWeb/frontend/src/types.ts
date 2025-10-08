// Simple types for the frontend
export interface CubeState {
  id: string;
  faces: {
    front: string[];
    back: string[];
    left: string[];
    right: string[];
    up: string[];
    down: string[];
  };
  timestamp: number;
}

export interface Move {
  face: 'F' | 'B' | 'L' | 'R' | 'U' | 'D';
  direction: 'clockwise' | 'counterclockwise' | 'double';
  notation: string;
}

export interface SolveResult {
  moves: Move[];
  algorithm: string;
  duration: number;
  status: 'solved' | 'partial' | 'failed';
}