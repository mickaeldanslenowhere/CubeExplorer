import { CubeFace, CubeFaces, getFaceLetter, oppositeFaces } from './CubeFace';
import { CubeFacets } from './CubeFacet';
import { defaultCubeState } from './CubeState';
import { CubeStateType } from './CubeState';
import { type MatrixPoint } from './MoveMatrix';

/**
 * Represents an edge piece with its two colors
 */
export type Edge = {
  facet1: MatrixPoint;
  facet2: MatrixPoint;
}

export function isEdge(cubie: Edge | Corner): cubie is Edge {
    return 'facet2' in cubie && !('facet3' in cubie);
  }

/**
 * Represents a corner piece with its three colors
 */
export type Corner = {
    facet1: MatrixPoint;
    facet2: MatrixPoint;
    facet3: MatrixPoint;
}

export function isCorner(cubie: Edge | Corner): cubie is Corner {
    return 'facet3' in cubie;
  }

export const Edges: Edge[] = [
    { facet1: { face: CubeFaces.UP, index: 1 }, facet2: { face: CubeFaces.BACK, index: 7 } }, // UB edge
    { facet1: { face: CubeFaces.UP, index: 5 }, facet2: { face: CubeFaces.RIGHT, index: 1 } }, // UR edge
    { facet1: { face: CubeFaces.UP, index: 7 }, facet2: { face: CubeFaces.FRONT, index: 1 } }, // UF edge
    { facet1: { face: CubeFaces.UP, index: 3 }, facet2: { face: CubeFaces.LEFT, index: 7 } }, // UL edge
    { facet1: { face: CubeFaces.DOWN, index: 1 }, facet2: { face: CubeFaces.FRONT, index: 7 } }, // DF edge
    { facet1: { face: CubeFaces.DOWN, index: 5 }, facet2: { face: CubeFaces.RIGHT, index: 7 } }, // DR edge
    { facet1: { face: CubeFaces.DOWN, index: 7 }, facet2: { face: CubeFaces.BACK, index: 1 } }, // DB edge
    { facet1: { face: CubeFaces.DOWN, index: 3 }, facet2: { face: CubeFaces.LEFT, index: 1 } }, // DL edge
    { facet1: { face: CubeFaces.FRONT, index: 5 }, facet2: { face: CubeFaces.RIGHT, index: 3 } }, // FR edge
    { facet1: { face: CubeFaces.FRONT, index: 3 }, facet2: { face: CubeFaces.LEFT, index: 3 } }, // FL edge
    { facet1: { face: CubeFaces.BACK, index: 3 }, facet2: { face: CubeFaces.LEFT, index: 5 } }, // BL edge
    { facet1: { face: CubeFaces.BACK, index: 5 }, facet2: { face: CubeFaces.RIGHT, index: 5 } }, // BR edge
]

export const Corners: Corner[] = [
    { facet1: { face: CubeFaces.UP, index: 0 }, facet2: { face: CubeFaces.BACK, index: 6 }, facet3: { face: CubeFaces.LEFT, index: 8 } }, // UBL corner
    { facet1: { face: CubeFaces.UP, index: 2 }, facet2: { face: CubeFaces.BACK, index: 8 }, facet3: { face: CubeFaces.RIGHT, index: 2 } }, // UBR corner
    { facet1: { face: CubeFaces.UP, index: 6 }, facet2: { face: CubeFaces.FRONT, index: 0 }, facet3: { face: CubeFaces.LEFT, index: 6 } }, // UFL corner
    { facet1: { face: CubeFaces.UP, index: 8 }, facet2: { face: CubeFaces.FRONT, index: 2 }, facet3: { face: CubeFaces.RIGHT, index: 0 } }, // UFR corner
    { facet1: { face: CubeFaces.DOWN, index: 0 }, facet2: { face: CubeFaces.FRONT, index: 6 }, facet3: { face: CubeFaces.LEFT, index: 0 } }, // DFL corner
    { facet1: { face: CubeFaces.DOWN, index: 2 }, facet2: { face: CubeFaces.FRONT, index: 8 }, facet3: { face: CubeFaces.RIGHT, index: 6 } }, // DFR corner
    { facet1: { face: CubeFaces.DOWN, index: 6 }, facet2: { face: CubeFaces.BACK, index: 0 }, facet3: { face: CubeFaces.LEFT, index: 2 } }, // DBL corner
    { facet1: { face: CubeFaces.DOWN, index: 8 }, facet2: { face: CubeFaces.BACK, index: 2 }, facet3: { face: CubeFaces.RIGHT, index: 8 } }, // DBR corner
]

export type Cubies = Edge[] | Corner[];

export function getCubieName<C extends Edge | Corner>(cubie: C): string {
    if (isEdge(cubie)) {
        const edge = cubie as Edge;
        return `${getFaceLetter(edge.facet1.face)}${getFaceLetter(edge.facet2.face)}`;
    } else {
        const corner = cubie as Corner;
        return `${getFaceLetter(corner.facet1.face)}${getFaceLetter(corner.facet2.face)}${getFaceLetter(corner.facet3.face)}`;
    }
}

export function getEdgeOrientation(edge: Edge, defaultEdge: Edge, cubeState: CubeStateType): number {
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

export function getCornerOrientation(corner: Corner, cubeState: CubeStateType): number {
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
