import type { MoveMatrix } from "./MoveMatrix";

export const sMoveMatrix: MoveMatrix = {
    right: [
        { face: 'right', index: 0 }, { face: 'up', index: 3 }, { face: 'right', index: 2 },
        { face: 'right', index: 3 }, { face: 'up', index: 4 }, { face: 'right', index: 5 },
        { face: 'right', index: 6 }, { face: 'up', index: 5 }, { face: 'right', index: 8 },
    ],
    up: [
        { face: 'up', index: 0 }, { face: 'up', index: 1 }, { face: 'up', index: 2 },
        { face: 'left', index: 1 }, { face: 'left', index: 4 }, { face: 'left', index: 7 },
        { face: 'up', index: 6 }, { face: 'up', index: 7 }, { face: 'up', index: 8 },
    ],
    front: [
        { face: 'front', index: 0 }, { face: 'front', index: 1 }, { face: 'front', index: 2 },
        { face: 'front', index: 3 }, { face: 'front', index: 4 }, { face: 'front', index: 5 },
        { face: 'front', index: 6 }, { face: 'front', index: 7 }, { face: 'front', index: 8 },
    ],
    down: [
        { face: 'down', index: 0 }, { face: 'down', index: 1 }, { face: 'down', index: 2 },
        { face: 'right', index: 7 }, { face: 'right', index: 4 }, { face: 'right', index: 1 },
        { face: 'down', index: 6 }, { face: 'down', index: 7 }, { face: 'down', index: 8 },
    ],
    back: [
        { face: 'back', index: 0 }, { face: 'back', index: 1 }, { face: 'back', index: 2 },
        { face: 'back', index: 3 }, { face: 'back', index: 4 }, { face: 'back', index: 5 },
        { face: 'back', index: 6 }, { face: 'back', index: 7 }, { face: 'back', index: 8 },
    ],
    left: [
        { face: 'left', index: 0 }, { face: 'down', index: 5 }, { face: 'left', index: 2 },
        { face: 'left', index: 3 }, { face: 'down', index: 4 }, { face: 'left', index: 5 },
        { face: 'left', index: 6 }, { face: 'down', index: 3 }, { face: 'left', index: 8 },
    ],
}