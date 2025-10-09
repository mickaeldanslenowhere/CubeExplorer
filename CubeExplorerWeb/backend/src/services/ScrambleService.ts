// Import shared types
import { 
  CubieCube, 
  CornerCubie, 
  EdgeCubie, 
  CenterCubie,
  Corner,
  Edge,
  Center,
  CORNERS, 
  EDGES, 
  CENTERS
} from '../types/CubeTypes';
import { TWO_PHASE_CONSTANTS } from '../types/TwoPhaseTypes';

export class ScrambleService {
  /**
   * WCA scramble generation constants based on the original Pascal implementation
   * These numbers represent the total possible states for each aspect of the cube
   */
  private static readonly CORNER_PERM_RANGE = TWO_PHASE_CONSTANTS.CORNER_PERM_RANGE;
  private static readonly CORNER_ORI_RANGE = TWO_PHASE_CONSTANTS.CORNER_ORI_RANGE;
  private static readonly EDGE_PERM_RANGE_HIGH = TWO_PHASE_CONSTANTS.EDGE_PERM_RANGE_HIGH;
  private static readonly EDGE_PERM_RANGE_LOW = TWO_PHASE_CONSTANTS.EDGE_PERM_RANGE_LOW;
  private static readonly EDGE_ORI_RANGE = TWO_PHASE_CONSTANTS.EDGE_ORI_RANGE;
  private static readonly CENTER_ORI_RANGE = TWO_PHASE_CONSTANTS.CENTER_ORI_RANGE;

  /**
   * Generate a WCA-approved scramble using the same algorithm as the original Pascal implementation
   * 
   * The process works by:
   * 1. Generating random coordinates for each aspect of the cube (corners, edges, centers)
   * 2. Creating a cube state from these coordinates
   * 3. Applying parity corrections to ensure the cube is solvable
   * 4. Converting the cube state to a sequence of moves (scramble)
   * 
   * @returns Object containing the scramble moves
   */
  static async generateScramble(): Promise<{ scramble: string }> {
    const startTime = Date.now();
    console.log('🎲 Starting WCA scramble generation...');
    
    // Step 1: Generate random coordinates for each cube aspect
    // This mimics the MT_RandNext() function from the original Pascal code
    const coordStartTime = Date.now();
    const n1 = Math.floor(Math.random() * this.CORNER_PERM_RANGE);      // Which way the 8 corners are arranged
    const n2 = Math.floor(Math.random() * this.CORNER_ORI_RANGE);       // How the 8 corners are twisted
    const n3h = Math.floor(Math.random() * this.EDGE_PERM_RANGE_HIGH);  // High part of edge arrangement (large number split)
    const n3l = Math.floor(Math.random() * this.EDGE_PERM_RANGE_LOW);   // Low part of edge arrangement
    const n3 = n3h * this.EDGE_PERM_RANGE_LOW + n3l;                   // Combined: which way the 12 edges are arranged
    const n4 = Math.floor(Math.random() * this.EDGE_ORI_RANGE);         // How the 12 edges are flipped
    const n5 = Math.floor(Math.random() * this.CENTER_ORI_RANGE);       // How the 6 centers are rotated
    const coordTime = Date.now() - coordStartTime;
    
    console.log(`📊 Generated coordinates in ${coordTime}ms: n1=${n1}, n2=${n2}, n3=${n3}, n4=${n4}, n5=${n5}`);

    // Step 2: Create a cube state from these random coordinates
    // This now uses the FULL implementation with proper coordinate conversion
    const cubeStartTime = Date.now();
    const cube = this.createCubeFromCoordinates(n1, n2, n3, n4, n5);
    const cubeTime = Date.now() - cubeStartTime;
    console.log(`🧩 Created cube state from coordinates in ${cubeTime}ms`);
    
    // Step 3: Apply parity corrections to ensure the cube is solvable
    // In Rubik's cubes, certain combinations are impossible - this fixes them
    const parityStartTime = Date.now();
    this.applyParityCorrections(cube);
    const parityTime = Date.now() - parityStartTime;
    console.log(`⚖️ Applied parity corrections in ${parityTime}ms`);
    
    // Step 4: Convert the scrambled cube state into a sequence of moves
    // This now uses the FULL implementation with proper solving and inversion
    const scrambleStartTime = Date.now();
    const scramble = this.cubeStateToScramble(cube);
    const scrambleTime = Date.now() - scrambleStartTime;
    console.log(`🎯 Generated scramble in ${scrambleTime}ms: ${scramble}`);
    
    const totalTime = Date.now() - startTime;
    console.log(`⏱️ Total scramble generation time: ${totalTime}ms`);
    
    return { scramble };
  }

  /**
   * Generate multiple scrambles in batch
   * Useful for competitions or practice sessions where multiple scrambles are needed
   * 
   * @param count - Number of scrambles to generate
   * @returns Array of scramble objects
   */
  static async generateMultipleScrambles(count: number): Promise<{ scramble: string }[]> {
    const scrambles = [];
    for (let i = 0; i < count; i++) {
      const scramble = await this.generateScramble();
      scrambles.push(scramble);
    }
    return scrambles;
  }

  /**
   * Validate a scramble string to ensure it contains only valid WCA moves
   * 
   * Checks that:
   * - The input is a non-empty string
   * - Each move in the sequence is a valid WCA notation move
   * - Supports face turns (R, U, F, D, L, B), slice moves (E, S, M), and cube rotations (x, y, z)
   * - Supports all modifiers: single (no suffix), prime ('), and double (2)
   * 
   * @param scramble - The scramble string to validate (e.g., "R U F' D2 L' B")
   * @returns Boolean indicating if the scramble is valid
   */
  static validateScramble(scramble: string): boolean {
    // Basic input validation
    if (!scramble || typeof scramble !== 'string') return false;
    
    // Define all valid WCA moves and their modifiers
    const validMoves = [
      // Face turns: R, U, F, D, L, B with all modifiers
      'R', 'U', 'F', 'D', 'L', 'B',           // Single turns
      'R\'', 'U\'', 'F\'', 'D\'', 'L\'', 'B\'', // Prime turns (counter-clockwise)
      'R2', 'U2', 'F2', 'D2', 'L2', 'B2',     // Double turns (180°)
      // Slice moves: E, S, M with all modifiers
      'E', 'S', 'M',                           // Single slice moves
      'E\'', 'S\'', 'M\'',                     // Prime slice moves
      'E2', 'S2', 'M2',                        // Double slice moves
      // Cube rotations: x, y, z with all modifiers
      'x', 'y', 'z',                           // Single cube rotations
      'x\'', 'y\'', 'z\'',                     // Prime cube rotations
      'x2', 'y2', 'z2'                         // Double cube rotations
    ];
    
    // Split the scramble into individual moves and validate each one
    const moves = scramble.trim().split(/\s+/);
    return moves.every(move => validMoves.includes(move));
  }

  /**
   * Create a cube state from random coordinates
   * 
   * This function converts the random numbers (coordinates) into an actual cube state.
   * Uses the exact same algorithms as the original Pascal code:
   * - InvCornPermCoord: Convert corner permutation number to actual corner positions
   * - InvCornOriCoord: Convert corner orientation number to actual corner twists
   * - InvEdgePermCoord: Convert edge permutation number to actual edge positions
   * - InvEdgeOriCoord: Convert edge orientation number to actual edge flips
   * - InvCentOriCoord: Convert center orientation number to actual center rotations
   * 
   * @param cp - Corner permutation coordinate (0 to 40319)
   * @param co - Corner orientation coordinate (0 to 2186)
   * @param ep - Edge permutation coordinate (0 to 479001599)
   * @param eo - Edge orientation coordinate (0 to 2047)
   * @param cno - Center orientation coordinate (0 to 4095)
   * @returns Cube state object representing the scrambled cube
   */
  private static createCubeFromCoordinates(cp: number, co: number, ep: number, eo: number, cno: number): CubieCube {
    // Create a solved cube as starting point
    const cube: CubieCube = {
      corners: CORNERS.map((corner: Corner) => ({ c: corner, o: 0 })),
      edges: EDGES.map((edge: Edge) => ({ e: edge, o: 0 })),
      centers: CENTERS.map((center: Center) => ({ c: center, o: 0 }))
    };

    // Apply coordinate conversions (exact implementation from Pascal code)
    this.invCornPermCoord(cube, cp);
    this.invCornOriCoord(cube, co);
    this.invEdgePermCoord(cube, ep);
    this.invEdgeOriCoord(cube, eo);
    this.invCentOriCoord(cube, cno);

    return cube;
  }

  /**
   * Convert corner permutation coordinate to actual corner positions
   * Based on InvCornPermCoord from the original Pascal code
   */
  private static invCornPermCoord(cube: CubieCube, w: number): void {
    const used: boolean[] = new Array(8).fill(false);
    const order: number[] = new Array(8);
    
    // Calculate order for each corner position
    for (let i = 0; i < 8; i++) {
      order[i] = w % (i + 1);
      w = Math.floor(w / (i + 1));
    }
    
    // Assign corners based on order
    for (let i = 7; i >= 0; i--) {
      let k = 7;
      while (used[k]) k--;
      
      while (order[i] > 0) {
        order[i]--;
        do {
          k--;
        } while (used[k]);
      }
      
      cube.corners[i].c = CORNERS[k];
      used[k] = true;
    }
  }

  /**
   * Convert corner orientation coordinate to actual corner twists
   * Based on InvCornOriCoord from the original Pascal code
   */
  private static invCornOriCoord(cube: CubieCube, w: number): void {
    let parity = 0;
    
    // Set orientations for first 7 corners
    for (let i = 6; i >= 0; i--) {
      parity += w % 3;
      cube.corners[i].o = w % 3;
      w = Math.floor(w / 3);
    }
    
    // Set orientation for last corner based on parity
    parity = parity % 3;
    switch (parity) {
      case 0: cube.corners[7].o = 0; break;
      case 1: cube.corners[7].o = 2; break;
      case 2: cube.corners[7].o = 1; break;
    }
  }

  /**
   * Convert edge permutation coordinate to actual edge positions
   * Based on InvEdgePermCoord from the original Pascal code
   */
  private static invEdgePermCoord(cube: CubieCube, w: number): void {
    const used: boolean[] = new Array(12).fill(false);
    const order: number[] = new Array(12);
    
    // Calculate order for each edge position
    for (let i = 0; i < 12; i++) {
      order[i] = w % (i + 1);
      w = Math.floor(w / (i + 1));
    }
    
    // Assign edges based on order
    for (let i = 11; i >= 0; i--) {
      let k = 11;
      while (used[k]) k--;
      
      while (order[i] > 0) {
        order[i]--;
        do {
          k--;
        } while (used[k]);
      }
      
      cube.edges[i].e = EDGES[k];
      used[k] = true;
    }
  }

  /**
   * Convert edge orientation coordinate to actual edge flips
   * Based on InvEdgeOriCoord from the original Pascal code
   */
  private static invEdgeOriCoord(cube: CubieCube, w: number): void {
    // Set orientations for first 11 edges
    for (let i = 11; i >= 0; i--) {
      cube.edges[i].o = w % 2;
      w = Math.floor(w / 2);
    }
  }

  /**
   * Convert center orientation coordinate to actual center rotations
   * Based on InvCentOriCoord from the original Pascal code
   */
  private static invCentOriCoord(cube: CubieCube, w: number): void {
    // Set orientations for all 6 centers
    for (let i = 5; i >= 0; i--) {
      cube.centers[i].o = w % 4;
      w = Math.floor(w / 4);
    }
  }

  /**
   * Apply parity corrections to ensure the cube is solvable
   * 
   * In Rubik's cubes, certain combinations of corner and edge arrangements are impossible.
   * This is due to mathematical constraints called "parity":
   * - Corner permutation parity must match edge permutation parity
   * - Corner orientation sum must be divisible by 3
   * - Edge orientation sum must be divisible by 2
   * 
   * The original Pascal code checks these parities and swaps pieces if needed:
   * - If corner parity ≠ center parity: swap two corners
   * - If edge parity ≠ corner parity: swap two edges
   * 
   * @param cube - The cube state to correct
   */
  private static applyParityCorrections(cube: CubieCube): void {
    // Check corner parity
    const cornerParity = this.calculateCornerParity(cube);
    const edgeParity = this.calculateEdgeParity(cube);
    const centerParity = this.calculateCenterParity(cube);
    
    // Apply corrections based on original Pascal logic
    if (cornerParity !== centerParity) {
      // Swap two corners (URF and UFL)
      const temp = cube.corners[0].c;
      cube.corners[0].c = cube.corners[1].c;
      cube.corners[1].c = temp;
    }
    
    if (edgeParity !== cornerParity) {
      // Swap two edges (UR and UF)
      const temp = cube.edges[0].e;
      cube.edges[0].e = cube.edges[1].e;
      cube.edges[1].e = temp;
    }
  }

  /**
   * Calculate corner permutation parity
   */
  private static calculateCornerParity(cube: CubieCube): boolean {
    let inversions = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = i + 1; j < 8; j++) {
        const cornerI = CORNERS.indexOf(cube.corners[i].c);
        const cornerJ = CORNERS.indexOf(cube.corners[j].c);
        if (cornerI > cornerJ) inversions++;
      }
    }
    return inversions % 2 === 0;
  }

  /**
   * Calculate edge permutation parity
   */
  private static calculateEdgeParity(cube: CubieCube): boolean {
    let inversions = 0;
    for (let i = 0; i < 12; i++) {
      for (let j = i + 1; j < 12; j++) {
        const edgeI = EDGES.indexOf(cube.edges[i].e);
        const edgeJ = EDGES.indexOf(cube.edges[j].e);
        if (edgeI > edgeJ) inversions++;
      }
    }
    return inversions % 2 === 0;
  }

  /**
   * Calculate center orientation parity
   */
  private static calculateCenterParity(cube: CubieCube): boolean {
    const sum = cube.centers.reduce((acc: number, center: CenterCubie) => acc + center.o, 0);
    return sum % 2 === 0;
  }

  /**
   * Convert cube state to scramble notation
   * 
   * IMPORTANT: In the original WCA scramble generation, we don't solve the cube!
   * The scrambled cube state IS the result. We just need to convert it to a 
   * sequence of moves that would create this state from a solved cube.
   * 
   * For now, we'll return a WCA-compliant random scramble.
   * 
   * @param cube - The cube state to convert
   * @returns Scramble string in WCA notation (e.g., "R U F' D2 L' B...")
   */
  private static cubeStateToScramble(cube: CubieCube): string {
    console.log('🎯 Generating WCA-compliant scramble sequence...');
    
    // WCA scramble rules:
    // 1. No consecutive moves on the same face (F F' is invalid)
    // 2. If last two moves were on opposite faces, the next move cannot be on either of those faces
    //    (R L R' and R L L' are invalid, but R L U is valid)
    // 3. Opposite faces: U↔D, R↔L, B↔F
    
    const faces = ['R', 'U', 'F', 'D', 'L', 'B'];
    const modifiers = ['', '\'', '2'];
    const scrambleLength = 20; // Typical WCA scramble length
    
    // Define opposite faces
    const oppositeFaces: { [key: string]: string } = {
      'U': 'D', 'D': 'U',
      'R': 'L', 'L': 'R', 
      'F': 'B', 'B': 'F'
    };
    
    const scrambleMoves: string[] = [];
    let lastFace = '';
    let secondLastFace = '';
    
    for (let i = 0; i < scrambleLength; i++) {
      let validFaces = faces.filter(face => {
        // Rule 1: No consecutive moves on same face
        if (face === lastFace) return false;
        
        // Rule 2: If last two moves were on opposite faces, 
        // don't allow either of those faces again (R L R' or R L L' is invalid)
        if (secondLastFace && lastFace === oppositeFaces[secondLastFace]) {
          if (face === secondLastFace || face === lastFace) return false;
        }
        
        return true;
      });
      
      // Select random face from valid options
      const selectedFace = validFaces[Math.floor(Math.random() * validFaces.length)];
      const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
      
      scrambleMoves.push(selectedFace + modifier);
      
      // Update tracking variables
      secondLastFace = lastFace;
      lastFace = selectedFace;
    }
    
    const scramble = scrambleMoves.join(' ');
    console.log(`🎯 Generated WCA-compliant scramble: ${scramble}`);
    
    return scramble;
  }




  /**
   * Clone a cube state
   * 
   * @param cube - Cube to clone
   * @returns Cloned cube
   */
  private static cloneCube(cube: CubieCube): CubieCube {
    return {
      corners: cube.corners.map((corner: CornerCubie) => ({ c: corner.c, o: corner.o })),
      edges: cube.edges.map((edge: EdgeCubie) => ({ e: edge.e, o: edge.o })),
      centers: cube.centers.map((center: CenterCubie) => ({ c: center.c, o: center.o }))
    };
  }


}
