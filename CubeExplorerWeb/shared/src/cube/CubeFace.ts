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
