import CubeState, { type CubeStateType } from './CubeState';
import { applyMove, CubeRotations } from './CubeMove';
import { CubeFaces, cubeFaces } from './CubeFace';
import { getCornerOrientation, getEdgeOrientation, isEdge, type Corner, type Edge } from './Cubies';
import { CubiesCycleVisitResult } from './CubiesCycle';
import { CubeVisitor } from './CubeVisitor';

/**
 * Validates if a cubeState object is valid
 * @param cubeState - The cubeState object to validate
 * @returns Boolean indicating if the cubeState is valid
 */
export function isValidCubeState(cs: CubeState): boolean {

  const cubeState = cs.getCubeState();
  if (!cubeState || typeof cubeState !== 'object') {
    throw new Error('Invalid cube state, not an object');
  }

  // Count occurrences of each color across all faces
  const colorCount: { [key: string]: number } = {};
  
  // Check if all required faces are present
  for (const face of cubeFaces) {
    if (!cubeState[face] || !Array.isArray(cubeState[face]) || cubeState[face].length !== 9) {
      throw new Error(`Invalid cube state, face ${face} is invalid`);
    }
    for (const color of cubeState[face]) {
      colorCount[color] = (colorCount[color] || 0) + 1;
      if (colorCount[color] > 9) {
        throw new Error(`Invalid cube state, color ${color} appears more than 9 times`);
      }
    }
  }
  
  // Check that centers are in their correct relative positions
  if (!areCentersInCorrectRelativePositions(cubeState)) {
    throw new Error('Invalid cube state, centers are not in correct relative positions');
  }

  return CubeStateValidator.getInstance().visit(cs).result;
}


function areCentersInSamePosition(cubeState: CubeStateType, cubeStateToCheck: CubeStateType): boolean {
  return cubeState[CubeFaces.UP][4] === cubeStateToCheck[CubeFaces.UP][4]
  && cubeState[CubeFaces.FRONT][4] === cubeStateToCheck[CubeFaces.FRONT][4]
  && cubeState[CubeFaces.DOWN][4] === cubeStateToCheck[CubeFaces.DOWN][4]
  && cubeState[CubeFaces.BACK][4] === cubeStateToCheck[CubeFaces.BACK][4]
  && cubeState[CubeFaces.LEFT][4] === cubeStateToCheck[CubeFaces.LEFT][4]
  && cubeState[CubeFaces.RIGHT][4] === cubeStateToCheck[CubeFaces.RIGHT][4];
}

/**
 * Validates that centers are in their correct relative positions
 * In a standard Rubik's cube, the relative positions are:
 * - UP (white) is opposite to DOWN (yellow)
 * - FRONT (red) is opposite to BACK (orange) 
 * - LEFT (green) is opposite to RIGHT (blue)
 * @param cubeState - The cubeState object to validate
 * @returns Boolean indicating if centers are in correct relative positions
 */
function areCentersInCorrectRelativePositions(cubeState: CubeStateType): boolean {
  // in order to check we will create a dedicated cubestate that we will rotate on the axes and check the centers
  const cubeStateToCheck = new CubeState();

  return areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState()) || // U UP, F Front
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && applyMove(cubeStateToCheck, CubeRotations.x) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) || // F up, D front
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && applyMove(cubeStateToCheck, CubeRotations.x) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) || // D up, B front
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && applyMove(cubeStateToCheck, CubeRotations.x) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) || // B up, U front
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && applyMove(cubeStateToCheck, CubeRotations.x) && applyMove(cubeStateToCheck, CubeRotations.z) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) || // L up, F front
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.z) && applyMove(cubeStateToCheck, CubeRotations.z) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) || // R up, D front
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(cubeState, cubeStateToCheck.getCubeState()));
}

class CubeStateValidator extends CubeVisitor<number, number, {
  orientation: number,
  parity: number,
}, boolean> {
  private static instance: CubeStateValidator | null = null;
  private constructor() {
    super();
  }
  protected cubieInfo<Cubie extends Edge | Corner>({ cubie, initialPosition }: { cubie: Cubie; initialPosition: Cubie; }): number {
    const cubeStateToUse = this.cubeState!.getCubeState();
    const orientation = isEdge(cubie) ? getEdgeOrientation(cubie, initialPosition, cubeStateToUse) : getCornerOrientation(cubie, cubeStateToUse);
    return orientation;
  }

  protected cycleResult<Cubie extends Edge | Corner>(cycleResultInput: { cubieInfo: { cubie: Cubie; info: number; }; accumulator: number; }): number {
    return cycleResultInput.accumulator + cycleResultInput.cubieInfo.info;
  }
  protected groupResult<Cubie extends Edge | Corner>({ cycle, accumulator }: { cycle: { cubies: { cubie: Cubie; info: number; }[]; cycleResult: number; }; accumulator: { orientation: number; parity: number; }; }): { orientation: number; parity: number; } {
    return {
      orientation: accumulator.orientation + cycle.cycleResult,
      parity: accumulator.parity + (cycle.cubies.length + 1),
    }
  }
  protected cubeResult(cubeResultInput: { corners: { cycles: { cubies: { cubie: Corner; info: number; }[]; cycleResult: number; }[]; cornersResult: { orientation: number; parity: number; }; }; edges: { cycles: { cubies: { cubie: Edge; info: number; }[]; cycleResult: number; }[]; edgesResult: { orientation: number; parity: number; }; }; accumulator: boolean; }): boolean {
    if (cubeResultInput.corners.cornersResult.orientation % 3 !== 0) {
      throw new Error('Invalid cube state, corner orientation is not 0 modulo 3');
    }
    if (cubeResultInput.edges.edgesResult.orientation % 2 !== 0) {
      throw new Error('Invalid cube state, edge orientation is not 0 modulo 2');
    }
    if (cubeResultInput.corners.cornersResult.parity % 2 !== cubeResultInput.edges.edgesResult.parity % 2) {
      throw new Error('Invalid cube state, corner parity is not equal to edge parity');
    }
    return cubeResultInput.accumulator;
  }
  protected initialCycleAccumulator(): number {
    return 0;
  }
  protected initialGroupAccumulator(): { orientation: number; parity: number; } {
    return { orientation: 0, parity: 0 };
  }
  protected initialCubeAccumulator(): boolean {
    return true;
  }

  public static getInstance(): CubeStateValidator {
    if (!CubeStateValidator.instance) {
      CubeStateValidator.instance = new CubeStateValidator();
    }
    return CubeStateValidator.instance;
  }
}
