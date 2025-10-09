import { MoveMatrix } from './rotations/MoveMatrix';
import { Color } from './colors';
import * as rotations from './rotations';

// Types basés sur le frontend
export interface CubeState {
  up: Color[];
  front: Color[];
  left: Color[];
  right: Color[];
  back: Color[];
  down: Color[];
}

export type CubeMove = 'R' | 'R\'' | 'U' | 'U\'' | 'F' | 'F\'' | 'D' | 'D\'' | 'L' | 'L\'' | 'B' | 'B\'';
export type SliceMove = 'E' | 'E\'' | 'S' | 'S\'' | 'M' | 'M\'';
export type CubeRotation = 'x' | 'x\'' | 'y' | 'y\'' | 'z' | 'z\'';
export type CubeAllMove = CubeMove | SliceMove | CubeRotation;

export class CubeLogicService {
  /**
   * Choisit la matrice de mouvement appropriée
   */
  static chooseMoveMatrix(move: string): MoveMatrix | null {
    switch (move) {
      case 'R': return rotations.rMoveMatrix;
      case 'R\'': return rotations.rPrimeMoveMatrix;
      case 'U': return rotations.uMoveMatrix;
      case 'U\'': return rotations.uPrimeMoveMatrix;
      case 'F': return rotations.fMoveMatrix;
      case 'F\'': return rotations.fPrimeMoveMatrix;
      case 'D': return rotations.dMoveMatrix;
      case 'D\'': return rotations.dPrimeMoveMatrix;
      case 'L': return rotations.lMoveMatrix;
      case 'L\'': return rotations.lPrimeMoveMatrix;
      case 'B': return rotations.bMoveMatrix;
      case 'B\'': return rotations.bPrimeMoveMatrix;
      case 'E': return rotations.eMoveMatrix;
      case 'E\'': return rotations.ePrimeMoveMatrix;
      case 'S': return rotations.sMoveMatrix;
      case 'S\'': return rotations.sPrimeMoveMatrix;
      case 'M': return rotations.mMoveMatrix;
      case 'M\'': return rotations.mPrimeMoveMatrix;
      case 'x': return rotations.xMoveMatrix;
      case 'x\'': return rotations.xPrimeMoveMatrix;
      case 'y': return rotations.yMoveMatrix;
      case 'y\'': return rotations.yPrimeMoveMatrix;
      case 'z': return rotations.zMoveMatrix;
      case 'z\'': return rotations.zPrimeMoveMatrix;
      default: return null;
    }
  }

  /**
   * Applique une matrice de mouvement à un état de cube
   */
  static applyMoveMatrix(state: CubeState, moveMatrix: MoveMatrix): CubeState {
    const newState: CubeState = {
      up: [...state.up],
      front: [...state.front],
      left: [...state.left],
      right: [...state.right],
      back: [...state.back],
      down: [...state.down]
    };
    
    // Applique la matrice de mouvement à l'état
    for (const face of Object.keys(moveMatrix)) {
      const points = moveMatrix[face as keyof MoveMatrix];
      for (const point of points) {
        const pointIndex = points.indexOf(point);
        const { face: sourceFace, index: sourceIndex } = point;
        newState[face as keyof CubeState][pointIndex] = state[sourceFace][sourceIndex];
      }
    }
    return newState;
  }

  /**
   * Applique un mouvement à un état de cube
   */
  static applyMove(state: CubeState, move: string): CubeState {
    const moveMatrix = this.chooseMoveMatrix(move);
    if (!moveMatrix) {
      throw new Error(`Move matrix for ${move} not found`);
    }
    return this.applyMoveMatrix(state, moveMatrix);
  }

  /**
   * Crée un cube résolu
   */
  static createSolvedCube(): CubeState {
    return {
      up: Array(9).fill('white'),
      front: Array(9).fill('red'),
      left: Array(9).fill('green'),
      right: Array(9).fill('blue'),
      back: Array(9).fill('orange'),
      down: Array(9).fill('yellow')
    };
  }

  /**
   * Parse un scramble en mouvements individuels
   */
  static parseScramble(scramble: string): string[] {
    const moves = scramble.trim().split(/\s+/).filter(move => move.length > 0);
    const expandedMoves: string[] = [];
    
    moves.forEach(move => {
      // Vérifie si c'est un double mouvement (ex: U2, R2, F2, etc.)
      if (move.length === 2 && move[1] === '2') {
        const baseMove = move[0];
        // Développe U2 en U U, R2 en R R, etc.
        expandedMoves.push(baseMove, baseMove);
      } else {
        // Mouvement régulier (simple ou prime)
        expandedMoves.push(move);
      }
    });
    
    return expandedMoves;
  }

  /**
   * Applique un scramble à un cube résolu
   */
  static applyScramble(scramble: string): CubeState {
    const moves = this.parseScramble(scramble);
    let currentState = this.createSolvedCube();
    
    moves.forEach(move => {
      currentState = this.applyMove(currentState, move);
    });
    
    return currentState;
  }

  /**
   * Valide si un scramble est valide
   */
  static isValidScramble(scramble: string): boolean {
    if (!scramble.trim()) return false;
    
    const moves = this.parseScramble(scramble);
    const allValidMoves: string[] = [
      'R', 'R\'', 'U', 'U\'', 'F', 'F\'', 'D', 'D\'', 'L', 'L\'', 'B', 'B\'',
      'E', 'E\'', 'S', 'S\'', 'M', 'M\'',
      'x', 'x\'', 'y', 'y\'', 'z', 'z\''
    ];
    
    return moves.every(move => allValidMoves.includes(move));
  }
}
