// Types partagés entre frontend et backend

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

export interface User {
  id: string;
  name: string;
  bestTime?: number;
  totalSolves: number;
}

export interface GameSession {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  moves: Move[];
  cubeState: CubeState;
  isCompleted: boolean;
}
