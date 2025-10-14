import { CubeFaces } from "../CubeFace";
import type { MoveMatrix } from "../MoveMatrix";

export const dPrimeMoveMatrix: MoveMatrix = {
    [CubeFaces.RIGHT]: [
        { face: CubeFaces.RIGHT, index: 0 }, { face: CubeFaces.RIGHT, index: 1 }, { face: CubeFaces.RIGHT, index: 2 },
        { face: CubeFaces.RIGHT, index: 3 }, { face: CubeFaces.RIGHT, index: 4 }, { face: CubeFaces.RIGHT, index: 5 },
        { face: CubeFaces.BACK, index: 2 }, { face: CubeFaces.BACK, index: 1 }, { face: CubeFaces.BACK, index: 0 },
    ],
    [CubeFaces.UP]: [
        { face: CubeFaces.UP, index: 0 }, { face: CubeFaces.UP, index: 1 }, { face: CubeFaces.UP, index: 2 },
        { face: CubeFaces.UP, index: 3 }, { face: CubeFaces.UP, index: 4 }, { face: CubeFaces.UP, index: 5 },
        { face: CubeFaces.UP, index: 6 }, { face: CubeFaces.UP, index: 7 }, { face: CubeFaces.UP, index: 8 },
    ],
    [CubeFaces.FRONT]: [
        { face: CubeFaces.FRONT, index: 0 }, { face: CubeFaces.FRONT, index: 1 }, { face: CubeFaces.FRONT, index: 2 },
        { face: CubeFaces.FRONT, index: 3 }, { face: CubeFaces.FRONT, index: 4 }, { face: CubeFaces.FRONT, index: 5 },
        { face: CubeFaces.RIGHT, index: 6 }, { face: CubeFaces.RIGHT, index: 7 }, { face: CubeFaces.RIGHT, index: 8 },
    ],
    [CubeFaces.DOWN]: [
        { face: CubeFaces.DOWN, index: 2 }, { face: CubeFaces.DOWN, index: 5 }, { face: CubeFaces.DOWN, index: 8 },
        { face: CubeFaces.DOWN, index: 1 }, { face: CubeFaces.DOWN, index: 4 }, { face: CubeFaces.DOWN, index: 7 },
        { face: CubeFaces.DOWN, index: 0 }, { face: CubeFaces.DOWN, index: 3 }, { face: CubeFaces.DOWN, index: 6 },
    ],
    [CubeFaces.BACK]: [
        { face: CubeFaces.LEFT, index: 0 }, { face: CubeFaces.LEFT, index: 1 }, { face: CubeFaces.LEFT, index: 2 },
        { face: CubeFaces.BACK, index: 3 }, { face: CubeFaces.BACK, index: 4 }, { face: CubeFaces.BACK, index: 5 },
        { face: CubeFaces.BACK, index: 6 }, { face: CubeFaces.BACK, index: 7 }, { face: CubeFaces.BACK, index: 8 },
    ],
    [CubeFaces.LEFT]: [
        { face: CubeFaces.FRONT, index: 8 }, { face: CubeFaces.FRONT, index: 7 }, { face: CubeFaces.FRONT, index: 6 },
        { face: CubeFaces.LEFT, index: 3 }, { face: CubeFaces.LEFT, index: 4 }, { face: CubeFaces.LEFT, index: 5 },
        { face: CubeFaces.LEFT, index: 6 }, { face: CubeFaces.LEFT, index: 7 }, { face: CubeFaces.LEFT, index: 8 },
    ],
}