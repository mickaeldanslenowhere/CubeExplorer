export class ValidationService {
  /**
   * Validate a cube state
   * @param cubeState - The cube state to validate
   * @returns Boolean indicating if the state is valid
   */
  static validateCubeState(cubeState: any): boolean {
    if (!cubeState) return false;
    
    const requiredFaces = ['up', 'front', 'left', 'right', 'back', 'down'];
    
    // Check if all required faces exist
    if (!requiredFaces.every(face => cubeState[face])) {
      return false;
    }
    
    // Check if each face has exactly 9 facelets
    if (!requiredFaces.every(face => 
      Array.isArray(cubeState[face]) && 
      cubeState[face].length === 9
    )) {
      return false;
    }
    
    // TODO: Add more validation rules
    // - Check color distribution (each color appears exactly 9 times)
    // - Check for impossible states
    // - Validate facelet colors
    
    return true;
  }

  /**
   * Validate a move string
   * @param move - The move to validate
   * @returns Boolean indicating if the move is valid
   */
  static validateMove(move: string): boolean {
    if (!move || typeof move !== 'string') return false;
    
    const validMoves = ['R', 'U', 'F', 'D', 'L', 'B', 'R\'', 'U\'', 'F\'', 'D\'', 'L\'', 'B\'', 
                       'R2', 'U2', 'F2', 'D2', 'L2', 'B2', 'E', 'S', 'M', 'E\'', 'S\'', 'M\'',
                       'E2', 'S2', 'M2', 'x', 'y', 'z', 'x\'', 'y\'', 'z\'', 'x2', 'y2', 'z2'];
    
    return validMoves.includes(move);
  }

  /**
   * Validate a sequence of moves
   * @param moves - Array of moves to validate
   * @returns Boolean indicating if all moves are valid
   */
  static validateMoveSequence(moves: string[]): boolean {
    if (!Array.isArray(moves)) return false;
    
    return moves.every(move => this.validateMove(move));
  }
}
