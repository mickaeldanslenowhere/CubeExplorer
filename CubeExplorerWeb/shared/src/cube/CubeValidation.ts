import CubeState, { defaultCubeState, type CubeStateType } from './CubeState';
import { applyMove, CubeRotations, cubeRotations } from './CubeMove';
import { CubeFace, CubeFaces, cubeFaces } from './CubeFace';
import { Corner, Corners, Edge, Edges } from './Cubies';
import { CubeFacets } from './CubeFacet';

const oppositeFaces = [
  {face: CubeFaces.UP, oppositeFace: CubeFaces.DOWN},
  {face: CubeFaces.FRONT, oppositeFace: CubeFaces.BACK},
  {face: CubeFaces.DOWN, oppositeFace: CubeFaces.UP},
  {face: CubeFaces.BACK, oppositeFace: CubeFaces.FRONT},
  {face: CubeFaces.LEFT, oppositeFace: CubeFaces.RIGHT},
  {face: CubeFaces.RIGHT, oppositeFace: CubeFaces.LEFT},
]

function isCorner(cubie: Edge | Corner): cubie is Corner {
  return 'facet3' in cubie;
}

function isEdge(cubie: Edge | Corner): cubie is Edge {
  return 'facet2' in cubie && !('facet3' in cubie);
}

/**
 * Validates if a cubeState object is valid
 * @param cubeState - The cubeState object to validate
 * @returns Boolean indicating if the cubeState is valid
 */
export function isValidCubeState(cubeState: CubeStateType): boolean {
  if (!cubeState || typeof cubeState !== 'object') {
    return false;
  }

  // Count occurrences of each color across all faces
  const colorCount: { [key: string]: number } = {};
  
  // Check if all required faces are present
  for (const face of cubeFaces) {
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

  try {
    const { parity: cornerParity, orientation: cornerOrientation } = visitCubies(Corners, cubeState);
    if (cornerOrientation % 3 !== 0) {
      return false;
    }
    const { parity: edgeParity, orientation: edgeOrientation } = visitCubies(Edges, cubeState);
    if (edgeOrientation % 2 !== 0) {
      return false;
    }
    // check full parity
    if (cornerParity !== edgeParity) {
      return false;
    }
  } catch (error) {
    return false;
  }

  return true;
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

function findEdgeOnStateInAnother(edge: Edge | null, state1: CubeStateType, state2: CubeStateType) {
  if (!edge) {
    return null;
  }
  const state1Facet1 = state1[edge.facet1.face][edge.facet1.index];
  const state1Facet2 = state1[edge.facet2.face][edge.facet2.index];
  if (state1Facet1 === state1Facet2) {
    return null;
  }
  for (const cubie of Edges) {
    const state2Facet1 = state2[cubie.facet1.face][cubie.facet1.index]
    const state2Facet2 = state2[cubie.facet2.face][cubie.facet2.index]
    if ((state1Facet1 === state2Facet1 && state1Facet2 === state2Facet2) || (state1Facet1 === state2Facet2 && state1Facet2 === state2Facet1))
    return cubie
  }
  return null;
}

function findCornerOnStateInAnother(corner: Corner | null, state1: CubeStateType, state2: CubeStateType) {
  if (!corner) {
    return null;
  }
  const state1Facet1 = state1[corner.facet1.face][corner.facet1.index];
  const state1Facet2 = state1[corner.facet2.face][corner.facet2.index];
  const state1Facet3 = state1[corner.facet3.face][corner.facet3.index];
  if (state1Facet1 === state1Facet2 || state1Facet1 === state1Facet3 || state1Facet2 === state1Facet3) {
    return null;
  }
  for (const cubie of Corners) {
    const state2Facet1 = defaultCubeState[cubie.facet1.face][cubie.facet1.index];
    const state2Facet2 = defaultCubeState[cubie.facet2.face][cubie.facet2.index];
    const state2Facet3 = defaultCubeState[cubie.facet3.face][cubie.facet3.index];
    if ((state1Facet1 === state2Facet1 && state1Facet2 === state2Facet2 && state1Facet3 === state2Facet3) ||
        (state1Facet1 === state2Facet1 && state1Facet2 === state2Facet3 && state1Facet3 === state2Facet2) ||
        (state1Facet1 === state2Facet2 && state1Facet2 === state2Facet1 && state1Facet3 === state2Facet3) ||
        (state1Facet1 === state2Facet2 && state1Facet2 === state2Facet3 && state1Facet3 === state2Facet1) ||
        (state1Facet1 === state2Facet3 && state1Facet2 === state2Facet1 && state1Facet3 === state2Facet2) ||
        (state1Facet1 === state2Facet3 && state1Facet2 === state2Facet2 && state1Facet3 === state2Facet1)
    ) {
      return cubie
    }
  }
  return null
}

function findEdgeInDefaultCube(edge: Edge | null, cubeState: CubeStateType) {
  return findEdgeOnStateInAnother(edge, cubeState, defaultCubeState)
}

function findDefaultEdgeInCubeState(edge: Edge | null, cubeState: CubeStateType) {
  return findEdgeOnStateInAnother(edge, defaultCubeState, cubeState)
}

function findCornerInDefaultCube(corner: Corner | null, cubeState: CubeStateType) {
  return findCornerOnStateInAnother(corner, cubeState, defaultCubeState)
}

function findDefaultCornerInCubeState(corner: Corner | null, cubeState: CubeStateType) {
  return findCornerOnStateInAnother(corner, defaultCubeState, cubeState)
}

function getCornerOrientation(corner: Corner, cubeState: CubeStateType): number {
  const cornerFacet = cubeState[corner.facet1.face][corner.facet1.index];
  const cornerFace2 = cubeState[corner.facet2.face][corner.facet2.index];
  const cornerFacet3 = cubeState[corner.facet3.face][corner.facet3.index];
  const wCornerState = [cornerFacet, cornerFace2, cornerFacet3].find(state => state === CubeFacets.WHITE || state === CubeFacets.YELLOW);
  if (!wCornerState) {
    throw new Error('Corner not found in default cube state (no W or Y face)');
  }
  let wFace, wIndex;
  if (wCornerState === cubeState[corner.facet1.face][corner.facet1.index]) {
    wFace = corner.facet1.face;
    wIndex = corner.facet1.index;
  } else if (wCornerState === cubeState[corner.facet2.face][corner.facet2.index]) {
    wFace = corner.facet2.face;
    wIndex = corner.facet2.index;
  } else {
    wFace = corner.facet3.face;
    wIndex = corner.facet3.index;
  }
  if (wFace === CubeFaces.UP || wFace === CubeFaces.DOWN) {
    return 0;
  } else {
    if (wIndex === 2 || wIndex === 6) {
      return 1;
    } else {
      return -1;
    }
  }
}

function getEdgeOrientation(edge: Edge, defaultEdge: Edge, cubeState: CubeStateType): number {
  const edgeFacet = cubeState[edge.facet1.face][edge.facet1.index];
  const edgeFacet2 = cubeState[edge.facet2.face][edge.facet2.index];
  const initialFacet1 = defaultCubeState[defaultEdge.facet1.face][4];
  const initialFacet2 = defaultCubeState[defaultEdge.facet2.face][4];
  const oppositeInitialFace1 = oppositeFaces.find(face => face.face === defaultEdge.facet1.face)?.oppositeFace;
  const oppositeInitialFace2 = oppositeFaces.find(face => face.face === defaultEdge.facet2.face)?.oppositeFace;
  const oppositeInitialFacet1 = defaultCubeState[oppositeInitialFace1 as CubeFace][4];
  const oppositeInitialFacet2 = defaultCubeState[oppositeInitialFace2 as CubeFace][4];
  // checking orientation
  if (edgeFacet === initialFacet1 || edgeFacet === oppositeInitialFacet1 || edgeFacet2 === initialFacet2 || edgeFacet2 === oppositeInitialFacet2) {
    return 0;
  } else {
    return 1;
  }
}

function followCubieCycle(startCubie: Edge | Corner, cubeState: CubeStateType, visitedCubies: boolean[]): {
  cycleLength: number;
  orientation: number;
} {
  let cubieToCheck: Edge | Corner | null = startCubie;
  let cycleLength = 0;
  let orientation = 0;
  
  while (cubieToCheck) {
    const cubieIndex = isEdge(cubieToCheck) ? Edges.indexOf(cubieToCheck) : Corners.indexOf(cubieToCheck);
    // If we've already visited this cubie, it's an unsolvable cube
    if (visitedCubies[cubieIndex]) {
      // we are back to the buffer
      if (cycleLength > 0 && cubieToCheck === startCubie) {
        return {
          cycleLength: cycleLength,
          orientation: orientation,
        };
      }
      throw new Error('Unsolvable cube: infinite cycle detected');
    }

    visitedCubies[cubieIndex] = true;
    const initialCubiePlace: Corner | Edge | null = isEdge(cubieToCheck) ? findEdgeInDefaultCube(cubieToCheck, cubeState) : findCornerInDefaultCube(cubieToCheck, cubeState);
    if (initialCubiePlace === null) {
      throw new Error('Cubie not found in default cube state');
    }
    // orientation check
    orientation += isEdge(cubieToCheck) ? getEdgeOrientation(cubieToCheck, initialCubiePlace, cubeState) : getCornerOrientation(cubieToCheck, cubeState);

    // the cubie was in the good position at start
    if (initialCubiePlace === startCubie) {
      return {
        cycleLength: cycleLength,
        orientation: orientation,
      };
    }

    cubieToCheck = isEdge(cubieToCheck) ? findDefaultEdgeInCubeState(initialCubiePlace as Edge, cubeState) : findDefaultCornerInCubeState(initialCubiePlace as Corner, cubeState);
    if (cubieToCheck === null) {
      throw new Error('Cubie not found current cube state');
    }
    // Mark as visited and increment counter
    cycleLength++;
  }

  throw new Error('We should have never reached this point');
}

function visitCubies(cubies: Edge[] | Corner[], cubeState: CubeStateType): { parity: number, orientation: number } {
  const visitedCubies = new Array(cubies.length).fill(false);
  let parity = 0;
  let orientation = 0;
  
  while (visitedCubies.includes(false)) {
    const unvisitedIndex = visitedCubies.findIndex(visited => !visited);
    if (unvisitedIndex === -1) break;
    
    const { cycleLength, orientation: cubieOrientation } = followCubieCycle(cubies[unvisitedIndex], cubeState, visitedCubies);
    parity += cycleLength;
    orientation += cubieOrientation;
  }

  return {
    parity: parity % 2,
    orientation: orientation,
  };
}