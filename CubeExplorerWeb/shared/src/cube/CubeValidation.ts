import CubeState, { type CubeStateType } from './CubeState';
import { CubeFacets } from './CubeFacet';
import { applyMove, CubeRotations, cubeRotations } from './CubeMove';

/**
 * Validates if a cubeState object is valid
 * @param cubeState - The cubeState object to validate
 * @returns Boolean indicating if the cubeState is valid
 */
export function isValidCubeState(cubeState: any): boolean {
  if (!cubeState || typeof cubeState !== 'object') {
    return false;
  }

  // Count occurrences of each color across all faces
  const colorCount: { [key: string]: number } = {};
  
  // Check if all required faces are present
  const requiredFaces = ['up', 'front', 'down', 'back', 'left', 'right'];
  for (const face of requiredFaces) {
    if (!cubeState[face] || !Array.isArray(cubeState[face]) || cubeState[face].length !== 9) {
      return false;
    }
    for (const color of cubeState[face]) {
      colorCount[color] = (colorCount[color] || 0) + 1;
      if (colorCount[color] > 9) {
        return false;
      }
    }
  }
  
  // Check that centers are in their correct relative positions
  if (!areCentersInCorrectRelativePositions(cubeState)) {
    return false;
  }

  return true;
}


function areCentersInSamePosition(cubeState: CubeStateType, cubeStateToCheck: CubeStateType): boolean {
  return cubeState.up[4] === cubeStateToCheck.up[4]
  && cubeState.front[4] === cubeStateToCheck.front[4]
  && cubeState.down[4] === cubeStateToCheck.down[4]
  && cubeState.back[4] === cubeStateToCheck.back[4]
  && cubeState.left[4] === cubeStateToCheck.left[4]
  && cubeState.right[4] === cubeStateToCheck.right[4];
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
function areCentersInCorrectRelativePositions(cubeState: CubeState): boolean {
  const innerCubeState = cubeState.getCubeState();
  // in order to check we will create a dedicated cubestate that we will rotate on the axes and check the centers
  const cubeStateToCheck = new CubeState();

  return areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState()) || // U UP, F Front
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && applyMove(cubeStateToCheck, CubeRotations.x) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) || // F up, D front
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && applyMove(cubeStateToCheck, CubeRotations.x) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) || // D up, B front
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && applyMove(cubeStateToCheck, CubeRotations.x) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) || // B up, U front
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && applyMove(cubeStateToCheck, CubeRotations.x) && applyMove(cubeStateToCheck, CubeRotations.z) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) || // L up, F front
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.z) && applyMove(cubeStateToCheck, CubeRotations.z) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) || // R up, D front
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState())) ||
  (applyMove(cubeStateToCheck, CubeRotations.y) && areCentersInSamePosition(innerCubeState, cubeStateToCheck.getCubeState()));
}
