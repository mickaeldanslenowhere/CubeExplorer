import CubeState, { defaultCubeState, type CubeStateType } from './CubeState';
import { applyMove, CubeRotations } from './CubeMove';
import { CubeFaces, cubeFaces, type CubeFace } from './CubeFace';
import { Corners, Edges, type Corner, type Edge } from './Cubies';
import { CubeFacets } from './CubeFacet';

export interface CycleInfo {
  cubies: string[];
  orientations: { [cubieName: string]: number };
}

const oppositeFaces = [
  {face: CubeFaces.UP, oppositeFace: CubeFaces.DOWN},
  {face: CubeFaces.FRONT, oppositeFace: CubeFaces.BACK},
  {face: CubeFaces.DOWN, oppositeFace: CubeFaces.UP},
  {face: CubeFaces.BACK, oppositeFace: CubeFaces.FRONT},
  {face: CubeFaces.LEFT, oppositeFace: CubeFaces.RIGHT},
  {face: CubeFaces.RIGHT, oppositeFace: CubeFaces.LEFT},
]

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

  const { parity: cornerParity, orientation: cornerOrientation } = visitCubies(Corners, cubeState);
  console.log(`Corner parity: ${cornerParity}, corner orientation: ${cornerOrientation}`);
  if (cornerOrientation % 3 !== 0) {
    throw new Error('Invalid cube state, corner orientation is not 0 modulo 3');
  }
  const { parity: edgeParity, orientation: edgeOrientation } = visitCubies(Edges, cubeState);
  console.log(`Edge parity: ${edgeParity}, edge orientation: ${edgeOrientation}`);
  if (edgeOrientation % 2 !== 0) {
    throw new Error('Invalid cube state, edge orientation is not 0 modulo 2');
  }
  // check full parity
  if (cornerParity !== edgeParity) {
    throw new Error('Invalid cube state, corner parity is not equal to edge parity');
  }

  return true;
}

export function getCubeCycles(cubeState: CubeStateType): { cornerCycles: CycleInfo[], edgeCycles: CycleInfo[] } {
  const { cycles: cornerCycles } = visitCubies(Corners, cubeState);
  const { cycles: edgeCycles } = visitCubies(Edges, cubeState);
  
  return {
    cornerCycles,
    edgeCycles
  };
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
    const state2Facet1 = state2[cubie.facet1.face][cubie.facet1.index];
    const state2Facet2 = state2[cubie.facet2.face][cubie.facet2.index];
    const state2Facet3 = state2[cubie.facet3.face][cubie.facet3.index];
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

// Helper function to convert face names to letters
function faceToLetter(face: string): string {
  switch (face) {
    case 'up': return 'U';
    case 'front': return 'F';
    case 'down': return 'D';
    case 'back': return 'B';
    case 'left': return 'L';
    case 'right': return 'R';
    default: return face;
  }
}

// Helper function to get concise cubie names
function getCubieName(cubie: Edge | Corner): string {
  if (isEdge(cubie)) {
    const edge = cubie as Edge;
    return `${faceToLetter(edge.facet1.face)}${faceToLetter(edge.facet2.face)}`;
  } else {
    const corner = cubie as Corner;
    return `${faceToLetter(corner.facet1.face)}${faceToLetter(corner.facet2.face)}${faceToLetter(corner.facet3.face)}`;
  }
}

function followCubieCycle(startCubie: Edge | Corner, cubeState: CubeStateType, visitedCubies: boolean[]): {
  cycleLength: number;
  orientation: number;
  cycleCubies: string[];
  cycleOrientations: { [cubieName: string]: number };
} {
  let cubieToCheck: Edge | Corner | null = startCubie;
  let cycleLength = 0;
  let orientation = 0;
  const cycleCubies: string[] = [];
  const cycleOrientations: { [cubieName: string]: number } = {};
  
  const isCorner = !isEdge(cubieToCheck);
  const cubieName = getCubieName(cubieToCheck);
  
  console.log(`\n=== DÉBUT CYCLE ${isCorner ? 'COIN' : 'ARÊTE'} ===`);
  console.log(`${isCorner ? 'Coin' : 'Arête'} ${cubieName}`);
  
  while (cubieToCheck) {
    const cubieIndex = isEdge(cubieToCheck) ? Edges.indexOf(cubieToCheck) : Corners.indexOf(cubieToCheck);
    const currentCubieName = getCubieName(cubieToCheck);
    
    // Ajouter la pièce au cycle
    cycleCubies.push(currentCubieName);
    
    // Log de la pièce actuelle
    if (isCorner) {
      const corner = cubieToCheck as Corner;
      const f1Color = cubeState[corner.facet1.face][corner.facet1.index];
      const f2Color = cubeState[corner.facet2.face][corner.facet2.index];
      const f3Color = cubeState[corner.facet3.face][corner.facet3.index];
      console.log(`-> ${faceToLetter(corner.facet1.face)}: ${f1Color}, ${faceToLetter(corner.facet2.face)}: ${f2Color}, ${faceToLetter(corner.facet3.face)}: ${f3Color}`);
    } else {
      const edge = cubieToCheck as Edge;
      const f1Color = cubeState[edge.facet1.face][edge.facet1.index];
      const f2Color = cubeState[edge.facet2.face][edge.facet2.index];
      console.log(`-> ${faceToLetter(edge.facet1.face)}: ${f1Color}, ${faceToLetter(edge.facet2.face)}: ${f2Color}`);
    }
    
    // If we've already visited this cubie, it's an unsolvable cube
    if (visitedCubies[cubieIndex]) {
      // we are back to the buffer
      if (cycleLength > 0 && cubieToCheck === startCubie) {
        console.log(`✓ Cycle terminé - Longueur: ${cycleLength}, Orientation: ${orientation}`);
        return {
          cycleLength: cycleLength,
          orientation: orientation,
          cycleCubies: cycleCubies,
          cycleOrientations: cycleOrientations,
        };
      }
      throw new Error('Unsolvable cube: infinite cycle detected');
    }

    visitedCubies[cubieIndex] = true;
    const initialCubiePlace: Corner | Edge | null = isEdge(cubieToCheck) ? findEdgeInDefaultCube(cubieToCheck, cubeState) : findCornerInDefaultCube(cubieToCheck, cubeState);
    if (initialCubiePlace === null) {
      throw new Error('Cubie not found in default cube state');
    }
    
    // Log de la position initiale attendue
    if (isCorner) {
      const corner = initialCubiePlace as Corner;
      const f1Color = defaultCubeState[corner.facet1.face][4];
      const f2Color = defaultCubeState[corner.facet2.face][4];
      const f3Color = defaultCubeState[corner.facet3.face][4];
      console.log(`(position cube initial : ${faceToLetter(corner.facet1.face)}${faceToLetter(corner.facet2.face)}${faceToLetter(corner.facet3.face)} -> ${faceToLetter(corner.facet1.face)}: ${f1Color}, ${faceToLetter(corner.facet2.face)}: ${f2Color}, ${faceToLetter(corner.facet3.face)}: ${f3Color})`);
    } else {
      const edge = initialCubiePlace as Edge;
      const f1Color = defaultCubeState[edge.facet1.face][4];
      const f2Color = defaultCubeState[edge.facet2.face][4];
      console.log(`(position cube initial : ${faceToLetter(edge.facet1.face)}${faceToLetter(edge.facet2.face)} -> ${faceToLetter(edge.facet1.face)}: ${f1Color}, ${faceToLetter(edge.facet2.face)}: ${f2Color})`);
    }
    
    // orientation check
    const currentOrientation = isEdge(cubieToCheck) ? getEdgeOrientation(cubieToCheck, initialCubiePlace, cubeState) : getCornerOrientation(cubieToCheck, cubeState);
    orientation += currentOrientation;
    cycleOrientations[currentCubieName] = currentOrientation;
    console.log(`orientation : ${currentOrientation} (total: ${orientation})`);

    // the cubie was in the good position at start
    if (initialCubiePlace === startCubie) {
      console.log(`✓ Pièce déjà à sa place - Longueur: ${cycleLength}, Orientation: ${orientation}`);
      return {
        cycleLength: cycleLength,
        orientation: orientation,
        cycleCubies: cycleCubies,
        cycleOrientations: cycleOrientations,
      };
    }

    cubieToCheck = initialCubiePlace;
    if (cubieToCheck === null) {
      throw new Error('Cubie not found current cube state');
    }
    // Mark as visited and increment counter
    cycleLength++;
    console.log(`-> Suivant: ${isCorner ? 'Coin' : 'Arête'} ${getCubieName(cubieToCheck)} (étape ${cycleLength})`);
  }

  throw new Error('We should have never reached this point');
}

function visitCubies(cubies: Edge[] | Corner[], cubeState: CubeStateType): { parity: number, orientation: number, cycles: CycleInfo[] } {
  const visitedCubies = new Array(cubies.length).fill(false);
  let parity = 0;
  let orientation = 0;
  const cycles: CycleInfo[] = [];
  
  const isCorner = cubies.length === 8; // 8 coins, 12 arêtes
  console.log(`\n🔍 === ANALYSE DES ${isCorner ? 'COINS' : 'ARÊTES'} ===`);
  
  let cycleCount = 0;
  while (visitedCubies.includes(false)) {
    const unvisitedIndex = visitedCubies.findIndex(visited => !visited);
    if (unvisitedIndex === -1) break;
    
    cycleCount++;
    const cubieName = getCubieName(cubies[unvisitedIndex]);
    
    console.log(`\n📍 CYCLE ${cycleCount} - ${isCorner ? 'Coin' : 'Arête'} ${cubieName} (index ${unvisitedIndex})`);
    const { cycleLength, orientation: cubieOrientation, cycleCubies, cycleOrientations } = followCubieCycle(cubies[unvisitedIndex], cubeState, visitedCubies);
    console.log(`📊 Résultat cycle ${cycleCount}: Longueur=${cycleLength}, Orientation=${cubieOrientation}`);
    
    // Ajouter le cycle à la liste
    cycles.push({
      cubies: cycleCubies,
      orientations: cycleOrientations
    });
    
    parity += cycleLength;
    orientation += cubieOrientation;
  }

  console.log(`\n📈 === RÉSUMÉ ${isCorner ? 'COINS' : 'ARÊTES'} ===`);
  console.log(`Total cycles: ${cycleCount}`);
  console.log(`Parité totale: ${parity} (mod 2: ${parity % 2})`);
  console.log(`Orientation totale: ${orientation}`);

  return {
    parity: parity % 2,
    orientation: orientation,
    cycles: cycles,
  };
}