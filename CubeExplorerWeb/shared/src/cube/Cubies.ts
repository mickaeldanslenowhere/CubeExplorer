import { CubeFaces } from './CubeFace';
import { type MatrixPoint } from './MoveMatrix';

/**
 * Represents an edge piece with its two colors
 */
export interface Edge {
  facet1: MatrixPoint;
  facet2: MatrixPoint;
}

/**
 * Represents a corner piece with its three colors
 */
export interface Corner {
    facet1: MatrixPoint;
    facet2: MatrixPoint;
    facet3: MatrixPoint;
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

