import { Move, CubeState } from './types';

// Algorithmes de résolution du cube de Rubik
export class CubeAlgorithms {
  // Génère un cube résolu
  static generateSolvedCube(): CubeState {
    return {
      id: 'solved',
      faces: {
        front: Array(9).fill('red'),
        back: Array(9).fill('orange'),
        left: Array(9).fill('green'),
        right: Array(9).fill('blue'),
        up: Array(9).fill('white'),
        down: Array(9).fill('yellow')
      },
      timestamp: Date.now()
    };
  }

  // Génère un cube mélangé
  static generateScrambledCube(): CubeState {
    const cube = this.generateSolvedCube();
    const moves = this.generateScramble(20);
    
    // Appliquer les mouvements de mélange
    moves.forEach(move => {
      this.applyMove(cube, move);
    });

    return cube;
  }

  // Génère une séquence de mélange
  static generateScramble(length: number = 20): Move[] {
    const faces: Move['face'][] = ['F', 'B', 'L', 'R', 'U', 'D'];
    const directions: Move['direction'][] = ['clockwise', 'counterclockwise', 'double'];
    const moves: Move[] = [];

    for (let i = 0; i < length; i++) {
      const face = faces[Math.floor(Math.random() * faces.length)];
      const direction = directions[Math.floor(Math.random() * directions.length)];
      
      moves.push({
        face,
        direction,
        notation: this.getMoveNotation(face, direction)
      });
    }

    return moves;
  }

  // Applique un mouvement au cube
  static applyMove(cube: CubeState, move: Move): void {
    // TODO: Implémenter la logique de rotation des faces
    console.log(`Applying move: ${move.notation}`);
  }

  // Obtient la notation d'un mouvement
  static getMoveNotation(face: Move['face'], direction: Move['direction']): string {
    const base = face;
    switch (direction) {
      case 'clockwise':
        return base;
      case 'counterclockwise':
        return base + "'";
      case 'double':
        return base + "2";
      default:
        return base;
    }
  }

  // Algorithme de résolution simple (CFOP simplifié)
  static solveCube(cube: CubeState): Move[] {
    // TODO: Implémenter l'algorithme de résolution
    // Pour l'instant, retourne une séquence d'exemple
    return [
      { face: 'R', direction: 'clockwise', notation: 'R' },
      { face: 'U', direction: 'clockwise', notation: 'U' },
      { face: 'R', direction: 'counterclockwise', notation: "R'" },
      { face: 'U', direction: 'counterclockwise', notation: "U'" }
    ];
  }
}
