import CubeState, { type CubeStateType } from './CubeState';
import { applyMove, CubeRotations, cubeRotations } from './CubeMove';
import { CubeFaces, cubeFaces } from './CubeFace';
import { Corners, Edges } from './Cubies';
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
  let sumEdgesOrientations = 0;
  for (const edge of Edges) {
    const edgeState = cubeState[edge.facet1.face][edge.facet1.index];
    const edgeState2 = cubeState[edge.facet2.face][edge.facet2.index];
    if (edgeState === edgeState2) {
     return false;
    }
    // now we have to find the edge in the default cube state
    // to do that, we will iterate over the default cube state and find the edge
    let foundEdge = false;
    let edgeStateFace1, edgeStateFace2, edgeStateIndex1, edgeStateIndex2;
    for (const cubie of Edges) {
      if (!foundEdge && foundPieces[cubie.facet1.face][cubie.facet1.index] === -1 && foundPieces[cubie.facet2.face][cubie.facet2.index] === -1) {
        const defaultFacet1 = defaultCubeState[cubie.facet1.face][cubie.facet1.index];
        const defaultFacet2 = defaultCubeState[cubie.facet2.face][cubie.facet2.index];
        if ((defaultFacet1 === edgeState && defaultFacet2 === edgeState2) || (defaultFacet1 === edgeState2 && defaultFacet2 === edgeState)) {
          foundEdge = true;
          edgeStateFace1 = cubie.facet1.face;
          edgeStateFace2 = cubie.facet2.face;
          edgeStateIndex1 = cubie.facet1.index;
          edgeStateIndex2 = cubie.facet2.index;
          break;
        }
      }
    }
    if (!foundEdge || !edgeStateFace1 || !edgeStateFace2 || !edgeStateIndex1 || !edgeStateIndex2) {
      return false;
    }

    /// now that we have found the edge, we have to check the orientation
    // the rule for the orientation of the edge is : if the edge is flipped, the orientation is 1, otherwise it's 0
    // to check if the pied is flipped, take the first face of the edge, if the color is on the same face as the initial/opposite face, the edge is not flipped
    // if not, check the second face of the edge, if the color is on the same face as the initial/opposite second face, the edge is not flipped
    // otherwise, the edge is flipped
    const oppositeFaces = [{face: CubeFaces.UP, oppositeFace: CubeFaces.DOWN}, {face: CubeFaces.FRONT, oppositeFace: CubeFaces.BACK}, {face: CubeFaces.DOWN, oppositeFace: CubeFaces.UP}, {face: CubeFaces.BACK, oppositeFace: CubeFaces.FRONT}, {face: CubeFaces.LEFT, oppositeFace: CubeFaces.RIGHT}, {face: CubeFaces.RIGHT, oppositeFace: CubeFaces.LEFT}];
    // get the center color of the face of the edgeState 1
    const centerColor1 = defaultCubeState[edgeStateFace1][4];
    if (centerColor1 === edgeState) {
      foundPieces[edgeStateFace1][edgeStateIndex1] = 0;
      foundPieces[edgeStateFace2][edgeStateIndex2] = 0;
      sumEdgesOrientations += 0;
    }
    if (foundPieces[edgeStateFace1][edgeStateIndex1] === -1) {
      const oppositeFace = oppositeFaces.find(face => face.face === edgeStateFace1)?.oppositeFace;
      if (oppositeFace) {
        const oppositeFaceColor1 = defaultCubeState[oppositeFace][4];
        if (oppositeFaceColor1 === edgeState) {
          foundPieces[edgeStateFace1][edgeStateIndex1] = 0;
          foundPieces[edgeStateFace2][edgeStateIndex2] = 0;
          sumEdgesOrientations += 0;
        }
      }
    }
    if (foundPieces[edgeStateFace1][edgeStateIndex1] === -1) {
      const centerColor2 = defaultCubeState[edgeStateFace2][4];
      if (centerColor2 === edgeState) {
        foundPieces[edgeStateFace1][edgeStateIndex1] = 0;
        foundPieces[edgeStateFace2][edgeStateIndex2] = 0;
        sumEdgesOrientations += 0;
      }
    }
    if (foundPieces[edgeStateFace1][edgeStateIndex1] === -1) {
      const oppositeFace = oppositeFaces.find(face => face.face === edgeStateFace2)?.oppositeFace;
      if (oppositeFace) {
        const oppositeFaceColor2 = defaultCubeState[oppositeFace][4];
        if (oppositeFaceColor2 === edgeState) {
          foundPieces[edgeStateFace1][edgeStateIndex1] = 0;
          foundPieces[edgeStateFace2][edgeStateIndex2] = 0;
          sumEdgesOrientations += 0;
        }
      }
    }
    if (foundPieces[edgeStateFace1][edgeStateIndex1] === -1) {
      foundPieces[edgeStateFace1][edgeStateIndex1] = 1;
      foundPieces[edgeStateFace2][edgeStateIndex2] = 1;
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
    const cornerState = cubeState[corner.facet1.face][corner.facet1.index];
    const cornerState2 = cubeState[corner.facet2.face][corner.facet2.index];
    const cornerState3 = cubeState[corner.facet3.face][corner.facet3.index];
    if (cornerState === cornerState2 || cornerState === cornerState3 || cornerState2 === cornerState3) {
      return false;
    }

    let foundCorner = false;
    let cornerStateFace1, cornerStateFace2, cornerStateFace3, cornerStateIndex1, cornerStateIndex2, cornerStateIndex3;
    for (const cubie of Corners) {
      if (!foundCorner && foundPieces[cubie.facet1.face][cubie.facet1.index] === -1 && foundPieces[cubie.facet2.face][cubie.facet2.index] === -1 && foundPieces[cubie.facet3.face][cubie.facet3.index] === -1) {
        const defaultFacet1 = defaultCubeState[cubie.facet1.face][cubie.facet1.index];
        const defaultFacet2 = defaultCubeState[cubie.facet2.face][cubie.facet2.index];
        const defaultFacet3 = defaultCubeState[cubie.facet3.face][cubie.facet3.index];
        if ((defaultFacet1 === cornerState && defaultFacet2 === cornerState2 && defaultFacet3 === cornerState3) ||
            (defaultFacet1 === cornerState && defaultFacet2 === cornerState3 && defaultFacet3 === cornerState2) ||
            (defaultFacet1 === cornerState2 && defaultFacet2 === cornerState && defaultFacet3 === cornerState3) ||
            (defaultFacet1 === cornerState2 && defaultFacet2 === cornerState3 && defaultFacet3 === cornerState) ||
            (defaultFacet1 === cornerState3 && defaultFacet2 === cornerState && defaultFacet3 === cornerState2) ||
            (defaultFacet1 === cornerState3 && defaultFacet2 === cornerState2 && defaultFacet3 === cornerState)) {
          foundCorner = true;
          cornerStateFace1 = cubie.facet1.face;
          cornerStateFace2 = cubie.facet2.face;
          cornerStateFace3 = cubie.facet3.face;
          cornerStateIndex1 = cubie.facet1.index;
          cornerStateIndex2 = cubie.facet2.index;
          cornerStateIndex3 = cubie.facet3.index;
          break;
        }
      }
    }
    if (!foundCorner || !cornerStateFace1 || !cornerStateFace2 || !cornerStateFace3 || !cornerStateIndex1 || !cornerStateIndex2 || !cornerStateIndex3) {
      return false;
    }

    // now we have to check the orientation
    // the rule for the orientation of the corner is : if the corner is twisted clockwise the orientation is 1, if it's twisted counter-clockwise the orientation is 2, otherwise it's 0
    // to check if the corner is twisted, take the first face of the corner, if the color is on the same face as the initial/opposite face, the corner is not twisted
    // as we only have 8 corners, we will only work with U and D faces

    // as a first version, we will do every corner on its own


    // first we have to found which cornerState is the W or Y one
    let wCornerState;
    wCornerState = [cornerState, cornerState2, cornerState3].find(state => state === CubeFacets.WHITE || state === CubeFacets.YELLOW);
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
      foundPieces[cornerStateFace1][cornerStateIndex1] = 0;
      foundPieces[cornerStateFace2][cornerStateIndex2] = 0;
      foundPieces[cornerStateFace3][cornerStateIndex3] = 0;
      sumCornersOrientations += 0;
    } else {
      if (wIndex === 2 || wIndex === 6) {
        foundPieces[cornerStateFace1][cornerStateIndex1] = 1;
        foundPieces[cornerStateFace2][cornerStateIndex2] = 1;
        foundPieces[cornerStateFace3][cornerStateIndex3] = 1;
        sumCornersOrientations += 1;
      } else {
        foundPieces[cornerStateFace1][cornerStateIndex1] = 2;
        foundPieces[cornerStateFace2][cornerStateIndex2] = 2;
        foundPieces[cornerStateFace3][cornerStateIndex3] = 2;
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
