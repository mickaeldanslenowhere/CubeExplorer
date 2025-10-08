// Types for the backend
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

// Socket.io event types
export interface SocketEvents {
  'cube-update': CubeState;
  'solve-request': { cubeState: CubeState; algorithm?: string };
  'solve-response': SolveResult;
  'solve-error': { message: string; error: string };
  'scramble-request': void;
  'scramble-response': { moves: Move[]; timestamp: string };
  'scramble-error': { message: string; error: string };
  'validate-move': { move: string; cubeState: CubeState };
  'move-validation': { move: string; isValid: boolean; timestamp: string };
  'move-validation-error': { message: string; error: string };
}
