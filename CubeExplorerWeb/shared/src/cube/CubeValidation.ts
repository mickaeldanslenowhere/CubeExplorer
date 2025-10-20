import CubeState, { defaultCubeState, type CubeStateType } from './CubeState';
import { applyMove, CubeRotations, cubeRotations } from './CubeMove';
import { CubeFace, CubeFaces, cubeFaces } from './CubeFace';
import { Corner, Corners, Edge, Edges } from './Cubies';
import { CubeFacets } from './CubeFacet';

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

  // Colors checks for edges
  // for every edges, we are checking that the two colors are correct
  // to do that, for every edges of the cube state, we are picking the two faces, we should find it in the default cube state are we are sure it's correct
  // also, we can't find a piece twice, so once a edge is found skip it for the next one
  const defaultCubeState = new CubeState().getCubeState();
  const foundPieces = {
    [CubeFaces.UP]: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [CubeFaces.FRONT]: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [CubeFaces.DOWN]: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [CubeFaces.BACK]: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [CubeFaces.LEFT]: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [CubeFaces.RIGHT]: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  };
  const oppositeFaces = [{face: CubeFaces.UP, oppositeFace: CubeFaces.DOWN}, {face: CubeFaces.FRONT, oppositeFace: CubeFaces.BACK}, {face: CubeFaces.DOWN, oppositeFace: CubeFaces.UP}, {face: CubeFaces.BACK, oppositeFace: CubeFaces.FRONT}, {face: CubeFaces.LEFT, oppositeFace: CubeFaces.RIGHT}, {face: CubeFaces.RIGHT, oppositeFace: CubeFaces.LEFT}];
  let sumEdgesOrientations = 0;
  for (const edge of Edges) {
    const defaultEdge = findEdgeInDefaultCube(edge, cubeState)
    if (!defaultEdge) {
      return false;
    }
    const edgeFacet = cubeState[edge.facet1.face][edge.facet1.index];
    const edgeFacet2 = cubeState[edge.facet2.face][edge.facet2.index];
    // now we have to find the edge in the default cube state
    // to do that, we will iterate over the default cube state and find the edge

    const initialFacet1 = defaultCubeState[defaultEdge.facet1.face][4];
    const initialFacet2 = defaultCubeState[defaultEdge.facet2.face][4];
    const oppositeinitialFace1 = oppositeFaces.find(face => face.face === defaultEdge.facet1.face)?.oppositeFace;
    const oppositeinitialFace2 = oppositeFaces.find(face => face.face === defaultEdge.facet2.face)?.oppositeFace;
    const oppositeInitialFacet1 = defaultCubeState[oppositeinitialFace1 as CubeFace][4];
    const oppositeInitialFacet2 = defaultCubeState[oppositeinitialFace2 as CubeFace][4];
    // checking orientation
    if (edgeFacet === initialFacet1 || edgeFacet === oppositeInitialFacet1 || edgeFacet2 === initialFacet2 || edgeFacet2 === oppositeInitialFacet2) {
      foundPieces[edge.facet1.face][edge.facet1.index] = 0;
      foundPieces[edge.facet2.face][edge.facet2.index] = 0;
      sumEdgesOrientations += 0;
    } else {
      foundPieces[edge.facet1.face][edge.facet1.index] = 1;
      foundPieces[edge.facet2.face][edge.facet2.index] = 1;
      sumEdgesOrientations += 1;
    }
  }

  // now that we have found the flipped edges, we have to check that the sum of orientation is 0 % 2 (we count one of 2 on the algo above)
  if (sumEdgesOrientations % 2 !== 0) {
    return false;
  }


  let sumCornersOrientations = 0;
  // now we do the same checks for the corners
  for (const corner of Corners) {
    const defaultCorner = findCornerInDefaultCube(corner, cubeState)
    if (!defaultCorner) {
      return false
    }
    const cornerFacet = cubeState[corner.facet1.face][corner.facet1.index];
    const cornerFace2 = cubeState[corner.facet2.face][corner.facet2.index];
    const cornerFacet3 = cubeState[corner.facet3.face][corner.facet3.index];
    

    // now we have to check the orientation
    // the rule for the orientation of the corner is : if the corner is twisted clockwise the orientation is 1, if it's twisted counter-clockwise the orientation is 2, otherwise it's 0
    // to check if the corner is twisted, take the first face of the corner, if the color is on the same face as the initial/opposite face, the corner is not twisted
    // as we only have 8 corners, we will only work with U and D faces

    // as a first version, we will do every corner on its own


    // first we have to found which cornerState is the W or Y one
    let wCornerState;
    wCornerState = [cornerFacet, cornerFace2, cornerFacet3].find(state => state === CubeFacets.WHITE || state === CubeFacets.YELLOW);
    if (!wCornerState) {
      return false;
    }

    let wFace, wIndex;
    // now, we find its position on the cube
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
      foundPieces[corner.facet1.face][corner.facet1.index] = 0;
      foundPieces[corner.facet2.face][corner.facet2.index] = 0;
      foundPieces[corner.facet3.face][corner.facet3.index] = 0;
      sumCornersOrientations += 0;
    } else {
      if (wIndex === 2 || wIndex === 6) {
        foundPieces[corner.facet1.face][corner.facet1.index] = 1;
        foundPieces[corner.facet2.face][corner.facet2.index] = 1;
        foundPieces[corner.facet3.face][corner.facet3.index] = 1;
        sumCornersOrientations += 1;
      } else {
        foundPieces[corner.facet1.face][corner.facet1.index] = 2;
        foundPieces[corner.facet2.face][corner.facet2.index] = 2;
        foundPieces[corner.facet3.face][corner.facet3.index] = 2;
        sumCornersOrientations += -1;
      }
    }
  }

  // compute of the sum of the corners orientations and check if it's 0
  if (sumCornersOrientations !== 0) {
    return false;
  }

  // the last thing we have to check is the permutation parity of the cube
  // we'll do the same as for a 3BLD memo
  // there is multiple way to memo at 3BLD so I'll use the one I am using atm, starting with corners
  
  // Calculate corner parity by following all cycles
  const foundCorners = new Array(Corners.length).fill(false);
  let cornerParity = 0;
  
  // Process all cycles
  try {
    while (foundCorners.includes(false)) {
      const unvisitedIndex = foundCorners.findIndex(visited => !visited);
      if (unvisitedIndex === -1) break;
      
      cornerParity += followCornerCycle(Corners[unvisitedIndex], cubeState, foundCorners);
      
    }
  } catch (error) {
    return false;
  }

  cornerParity = cornerParity % 2

  // Calculate edge parity by following all cycles
  const foundEdges = new Array(Edges.length).fill(false);
  let edgeParity = 0;
  
  // Process all cycles
  try {
    while (foundEdges.includes(false)) {
      const unvisitedIndex = foundEdges.findIndex(visited => !visited);
      if (unvisitedIndex === -1) break;
      
      edgeParity += followEdgeCycle(Edges[unvisitedIndex], cubeState, foundEdges);
      
    }
  } catch (error) {
    return false;
  }

  edgeParity = edgeParity % 2

  // check full parity
  if (cornerParity !== edgeParity) {
    return false;
  }
  



  // once the partiy alg is written, get back to the start of algo and optimise it as we can check orientation and everyother stuff
  // while searching for the next piece to find, basically, this will replace for const edge of Edges and corner of Corners with a
  // first edge to check (buffer) and then follow the cycles


  return true;
}

/**
 * Validates if a cubeState object is valid
 * @param cubeState - The cubeState object to validate
 * @returns Boolean indicating if the cubeState is valid
 */
export function isValidCubeState2(cubeState: CubeStateType): boolean {
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

  // Colors checks for edges
  // for every edges, we are checking that the two colors are correct
  // to do that, for every edges of the cube state, we are picking the two faces, we should find it in the default cube state are we are sure it's correct
  // also, we can't find a piece twice, so once a edge is found skip it for the next one
  const defaultCubeState = new CubeState().getCubeState();
  const foundPieces = {
    [CubeFaces.UP]: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [CubeFaces.FRONT]: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [CubeFaces.DOWN]: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [CubeFaces.BACK]: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [CubeFaces.LEFT]: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [CubeFaces.RIGHT]: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  };
  const oppositeFaces = [{face: CubeFaces.UP, oppositeFace: CubeFaces.DOWN}, {face: CubeFaces.FRONT, oppositeFace: CubeFaces.BACK}, {face: CubeFaces.DOWN, oppositeFace: CubeFaces.UP}, {face: CubeFaces.BACK, oppositeFace: CubeFaces.FRONT}, {face: CubeFaces.LEFT, oppositeFace: CubeFaces.RIGHT}, {face: CubeFaces.RIGHT, oppositeFace: CubeFaces.LEFT}];
  let sumEdgesOrientations = 0;
  for (const edge of Edges) {
    const defaultEdge = findEdgeInDefaultCube(edge, cubeState)
    if (!defaultEdge) {
      return false;
    }
    const edgeFacet = cubeState[edge.facet1.face][edge.facet1.index];
    const edgeFacet2 = cubeState[edge.facet2.face][edge.facet2.index];
    // now we have to find the edge in the default cube state
    // to do that, we will iterate over the default cube state and find the edge

    const initialFacet1 = defaultCubeState[defaultEdge.facet1.face][4];
    const initialFacet2 = defaultCubeState[defaultEdge.facet2.face][4];
    const oppositeinitialFace1 = oppositeFaces.find(face => face.face === defaultEdge.facet1.face)?.oppositeFace;
    const oppositeinitialFace2 = oppositeFaces.find(face => face.face === defaultEdge.facet2.face)?.oppositeFace;
    const oppositeInitialFacet1 = defaultCubeState[oppositeinitialFace1 as CubeFace][4];
    const oppositeInitialFacet2 = defaultCubeState[oppositeinitialFace2 as CubeFace][4];
    // checking orientation
    if (edgeFacet === initialFacet1 || edgeFacet === oppositeInitialFacet1 || edgeFacet2 === initialFacet2 || edgeFacet2 === oppositeInitialFacet2) {
      foundPieces[edge.facet1.face][edge.facet1.index] = 0;
      foundPieces[edge.facet2.face][edge.facet2.index] = 0;
      sumEdgesOrientations += 0;
    } else {
      foundPieces[edge.facet1.face][edge.facet1.index] = 1;
      foundPieces[edge.facet2.face][edge.facet2.index] = 1;
      sumEdgesOrientations += 1;
    }
  }

  // now that we have found the flipped edges, we have to check that the sum of orientation is 0 % 2 (we count one of 2 on the algo above)
  if (sumEdgesOrientations % 2 !== 0) {
    return false;
  }


  let sumCornersOrientations = 0;
  // now we do the same checks for the corners
  for (const corner of Corners) {
    const defaultCorner = findCornerInDefaultCube(corner, cubeState)
    if (!defaultCorner) {
      return false
    }
    const cornerFacet = cubeState[corner.facet1.face][corner.facet1.index];
    const cornerFace2 = cubeState[corner.facet2.face][corner.facet2.index];
    const cornerFacet3 = cubeState[corner.facet3.face][corner.facet3.index];
    

    // now we have to check the orientation
    // the rule for the orientation of the corner is : if the corner is twisted clockwise the orientation is 1, if it's twisted counter-clockwise the orientation is 2, otherwise it's 0
    // to check if the corner is twisted, take the first face of the corner, if the color is on the same face as the initial/opposite face, the corner is not twisted
    // as we only have 8 corners, we will only work with U and D faces

    // as a first version, we will do every corner on its own


    // first we have to found which cornerState is the W or Y one
    let wCornerState;
    wCornerState = [cornerFacet, cornerFace2, cornerFacet3].find(state => state === CubeFacets.WHITE || state === CubeFacets.YELLOW);
    if (!wCornerState) {
      return false;
    }

    let wFace, wIndex;
    // now, we find its position on the cube
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
      foundPieces[corner.facet1.face][corner.facet1.index] = 0;
      foundPieces[corner.facet2.face][corner.facet2.index] = 0;
      foundPieces[corner.facet3.face][corner.facet3.index] = 0;
      sumCornersOrientations += 0;
    } else {
      if (wIndex === 2 || wIndex === 6) {
        foundPieces[corner.facet1.face][corner.facet1.index] = 1;
        foundPieces[corner.facet2.face][corner.facet2.index] = 1;
        foundPieces[corner.facet3.face][corner.facet3.index] = 1;
        sumCornersOrientations += 1;
      } else {
        foundPieces[corner.facet1.face][corner.facet1.index] = 2;
        foundPieces[corner.facet2.face][corner.facet2.index] = 2;
        foundPieces[corner.facet3.face][corner.facet3.index] = 2;
        sumCornersOrientations += -1;
      }
    }
  }

  // compute of the sum of the corners orientations and check if it's 0
  if (sumCornersOrientations !== 0) {
    return false;
  }

  // the last thing we have to check is the permutation parity of the cube
  // we'll do the same as for a 3BLD memo
  // there is multiple way to memo at 3BLD so I'll use the one I am using atm, starting with corners
  
  // Calculate corner parity by following all cycles
  const foundCorners = new Array(Corners.length).fill(false);
  let cornerParity = 0;
  
  // Process all cycles
  try {
    while (foundCorners.includes(false)) {
      const unvisitedIndex = foundCorners.findIndex(visited => !visited);
      if (unvisitedIndex === -1) break;
      
      cornerParity += followCornerCycle(Corners[unvisitedIndex], cubeState, foundCorners);
      
    }
  } catch (error) {
    return false;
  }

  cornerParity = cornerParity % 2

  // Calculate edge parity by following all cycles
  const foundEdges = new Array(Edges.length).fill(false);
  let edgeParity = 0;
  
  // Process all cycles
  try {
    while (foundEdges.includes(false)) {
      const unvisitedIndex = foundEdges.findIndex(visited => !visited);
      if (unvisitedIndex === -1) break;
      
      edgeParity += followEdgeCycle(Edges[unvisitedIndex], cubeState, foundEdges);
      
    }
  } catch (error) {
    return false;
  }

  edgeParity = edgeParity % 2

  // check full parity
  if (cornerParity !== edgeParity) {
    return false;
  }
  



  // once the partiy alg is written, get back to the start of algo and optimise it as we can check orientation and everyother stuff
  // while searching for the next piece to find, basically, this will replace for const edge of Edges and corner of Corners with a
  // first edge to check (buffer) and then follow the cycles


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

// Helper function to follow a cycle and return its length
function followCornerCycle(startCorner: Corner, cubeState: CubeStateType, foundCorners: boolean[]): number {
  let cornerToCheck: Corner | null = startCorner;
  let cycleLength = 0;
  
  while (cornerToCheck) {
    const cornerIndex = Corners.indexOf(cornerToCheck);
    // If we've already visited this corner, it's an unsolvable cube
    if (foundCorners[cornerIndex]) {
      throw new Error('Unsolvable cube: infinite cycle detected');
    }

    foundCorners[cornerIndex] = true;
    // we are back to the buffer
    if (cycleLength > 0 && cornerToCheck === startCorner) {
      break;
    }
    
    const initialCornerPlace = findCornerInDefaultCube(cornerToCheck, cubeState);
    // the corner was in the good position at start
    if (initialCornerPlace === startCorner) {
      break;
    }

    cornerToCheck = findDefaultCornerInCubeState(initialCornerPlace, cubeState);
    if (cornerToCheck) {
      // Mark as visited and increment counter
      cycleLength++;
    }
  }
  
  return cycleLength;
}

function followEdgeCycle(startEdge: Edge, cubeState: CubeStateType, foundEdges: boolean[]): number {
  let edgeToCheck: Edge | null = startEdge;
  let cycleLength = 0;
  
  while (edgeToCheck) {
    const edgeIndex = Edges.indexOf(edgeToCheck);
    
    // If we've already visited this edge, it's an unsolvable cube
    if (foundEdges[edgeIndex]) {
      throw new Error('Unsolvable cube: infinite cycle detected');
    }
    
    foundEdges[edgeIndex] = true;
    // we are back to the buffer
    if (cycleLength > 0 && edgeToCheck === startEdge) {
      break;
    }
    
    const initialEdgePlace = findEdgeInDefaultCube(edgeToCheck, cubeState);
    // the edge was in the good position at start
    if (initialEdgePlace === startEdge) {
      break;
    }

    edgeToCheck = findDefaultEdgeInCubeState(initialEdgePlace, cubeState);
    if (edgeToCheck) {
      // Mark as visited and increment counter
      cycleLength++;
    }
  }
  
  return cycleLength;
}