import CubeState, { CubeStateType } from './CubeState';
import * as matrixes from './matrixes';
import { MoveMatrix } from './matrixes/MoveMatrix';

export const CubeMoves = {
    R: 'R',
    R_: 'R\'',
    U: 'U',
    U_: 'U\'',
    F: 'F',
    F_: 'F\'',
    D: 'D',
    D_: 'D\'',
    L: 'L',
    L_: 'L\'',
    B: 'B',
    B_: 'B\'',
}

export type CubeMove = typeof CubeMoves[keyof typeof CubeMoves];

export const cubeMoves = Object.values(CubeMoves);

export const CubeRotations = {
    x: 'x',
    x_: 'x\'',
    y: 'y',
    y_: 'y\'',
    z: 'z',
    z_: 'z\'',
}

export type CubeRotation = typeof CubeRotations[keyof typeof CubeRotations];

export const cubeRotations = Object.values(CubeRotations);

export const SliceMoves = {
    E: 'E',
    E_: 'E\'',
    S: 'S',
    S_: 'S\'',
    M: 'M',
    M_: 'M\'',
}

export const sliceMoves = Object.values(SliceMoves);

export type SliceMove = typeof SliceMoves[keyof typeof SliceMoves];

export type CubeAllMove = CubeMove | CubeRotation | SliceMove;

const allValidMoves = [...cubeMoves, ...cubeRotations, ...sliceMoves];

const chooseMoveMatrix = (move: string) => {
    switch (move) {
        case 'R': return matrixes.rMoveMatrix;
        case 'R\'': return matrixes.rPrimeMoveMatrix;
        case 'U': return matrixes.uMoveMatrix;
        case 'U\'': return matrixes.uPrimeMoveMatrix;
        case 'F': return matrixes.fMoveMatrix;
        case 'F\'': return matrixes.fPrimeMoveMatrix;
        case 'D': return matrixes.dMoveMatrix;
        case 'D\'': return matrixes.dPrimeMoveMatrix;
        case 'L': return matrixes.lMoveMatrix;
        case 'L\'': return matrixes.lPrimeMoveMatrix;
        case 'B': return matrixes.bMoveMatrix;
        case 'B\'': return matrixes.bPrimeMoveMatrix;
        case 'E': return matrixes.eMoveMatrix;
        case 'E\'': return matrixes.ePrimeMoveMatrix;
        case 'S': return matrixes.sMoveMatrix;
        case 'S\'': return matrixes.sPrimeMoveMatrix;
        case 'M': return matrixes.mMoveMatrix;
        case 'M\'': return matrixes.mPrimeMoveMatrix;
        case 'x': return matrixes.xMoveMatrix;
        case 'x\'': return matrixes.xPrimeMoveMatrix;
        case 'y': return matrixes.yMoveMatrix;
        case 'y\'': return matrixes.yPrimeMoveMatrix;
        case 'z': return matrixes.zMoveMatrix;
        case 'z\'': return matrixes.zPrimeMoveMatrix;
    }
}

const applyMoveMatrix = (cubeState: CubeState, moveMatrix: MoveMatrix): CubeStateType => {
    const state = cubeState.getCubeState();
    const newState = cubeState.getDeepCopy();
    
    // Apply the move matrix to the state
    for (const face of Object.keys(moveMatrix)) {
        const points = moveMatrix[face as keyof MoveMatrix];
        for (const point of points) {
            const pointIndex = points.indexOf(point);
            const { face: sourceFace, index: sourceIndex } = point;
            newState[face as keyof typeof newState][pointIndex] = state[sourceFace][sourceIndex];
        }
    }
    return newState;
}

const applyMove = (cubeState: CubeState, move: CubeAllMove) => {
    const moveMatrix = chooseMoveMatrix(move);
    if (!moveMatrix) {
        throw new Error(`Move matrix for ${move} not found`);
    }
    const newState = applyMoveMatrix(cubeState, moveMatrix);
    cubeState.setCubeState(newState);
}

const parseScramble = (scramble: string): string[] => {
    const moves = scramble.trim().split(/\s+/).filter(move => move.length > 0);
    const expandedMoves: string[] = [];
    
    moves.forEach(move => {
        // Check if it's a double move (e.g., U2, R2, F2, etc.)
        if (move.length === 2 && move[1] === '2') {
            const baseMove = move[0];
            // Expand U2 to U U, R2 to R R, etc.
            expandedMoves.push(baseMove, baseMove);
        } else {
            // Regular move (single or prime)
            expandedMoves.push(move);
        }
    });
    
    return expandedMoves;
};

const isValidScramble = (scramble: string): boolean => {
    if (!scramble || typeof scramble !== 'string' || !scramble.trim()) return false;
    const moves = parseScramble(scramble);
    // TODO: Add WCA scramble rules and double moves
    return moves.every(move => allValidMoves.includes(move));
}

const applyScramble = (cubeState: CubeState, scramble: string) => {
    if (!isValidScramble(scramble)) return;
    const moves = parseScramble(scramble);
    // Build the final state progressively
    
    moves.forEach(move => {
        const moveMatrix = chooseMoveMatrix(move);
        if (moveMatrix) {
            const currentState = applyMoveMatrix(cubeState, moveMatrix);
            cubeState.setCubeState(currentState);
        }
    });

    console.log(`Applied scramble: ${scramble}`);
}

export {
    applyMove,
    applyMoveMatrix,
    chooseMoveMatrix,
    applyScramble,
    allValidMoves,
    isValidScramble,
    parseScramble,
}