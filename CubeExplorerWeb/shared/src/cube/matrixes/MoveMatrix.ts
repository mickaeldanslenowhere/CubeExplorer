type MatrixPoint = {
    face: 'up' | 'front' | 'down' | 'back' | 'left' | 'right';
    index: number;
}

export type MoveMatrix = {
    up: MatrixPoint[];
    front: MatrixPoint[];
    down: MatrixPoint[];
    back: MatrixPoint[];
    left: MatrixPoint[];
    right: MatrixPoint[];
}
