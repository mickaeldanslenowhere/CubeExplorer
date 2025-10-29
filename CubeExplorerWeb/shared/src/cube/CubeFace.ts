export const CubeFaces = {
    UP: 'up',
    FRONT: 'front',
    DOWN: 'down',
    BACK: 'back',
    LEFT: 'left',
    RIGHT: 'right',
} as const;

export type CubeFace = typeof CubeFaces[keyof typeof CubeFaces];

export const cubeFaces = Object.values(CubeFaces);

export const oppositeFaces = [
    {face: CubeFaces.UP, oppositeFace: CubeFaces.DOWN},
    {face: CubeFaces.FRONT, oppositeFace: CubeFaces.BACK},
    {face: CubeFaces.DOWN, oppositeFace: CubeFaces.UP},
    {face: CubeFaces.BACK, oppositeFace: CubeFaces.FRONT},
    {face: CubeFaces.LEFT, oppositeFace: CubeFaces.RIGHT},
    {face: CubeFaces.RIGHT, oppositeFace: CubeFaces.LEFT},
  ]


export function getFaceLetter(face: CubeFace): string {
    switch (face) {
        case CubeFaces.UP: return 'U';
        case CubeFaces.FRONT: return 'F';
        case CubeFaces.DOWN: return 'D';
        case CubeFaces.BACK: return 'B';
        case CubeFaces.LEFT: return 'L';
        case CubeFaces.RIGHT: return 'R';
    }
}