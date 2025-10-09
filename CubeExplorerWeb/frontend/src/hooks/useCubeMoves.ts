import { useCubeContext } from "./useContexts";
import * as rotations from './rotations';
import type { MoveMatrix } from "./rotations/MoveMatrix";
import type { Color } from "./useColors";

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

export default function useCubeMoves() {
    const { cubeState, setCubeState } = useCubeContext();

    const chooseMoveMatrix = (move: string) => {
        switch (move) {
            case 'R': return rotations.rMoveMatrix;
            case 'R\'': return rotations.rPrimeMoveMatrix;
            case 'U': return rotations.uMoveMatrix;
            case 'U\'': return rotations.uPrimeMoveMatrix;
            case 'F': return rotations.fMoveMatrix;
            case 'F\'': return rotations.fPrimeMoveMatrix;
            case 'D': return rotations.dMoveMatrix;
            case 'D\'': return rotations.dPrimeMoveMatrix;
            case 'L': return rotations.lMoveMatrix;
            case 'L\'': return rotations.lPrimeMoveMatrix;
            case 'B': return rotations.bMoveMatrix;
            case 'B\'': return rotations.bPrimeMoveMatrix;
            case 'E': return rotations.eMoveMatrix;
            case 'E\'': return rotations.ePrimeMoveMatrix;
            case 'S': return rotations.sMoveMatrix;
            case 'S\'': return rotations.sPrimeMoveMatrix;
            case 'M': return rotations.mMoveMatrix;
            case 'M\'': return rotations.mPrimeMoveMatrix;
            case 'x': return rotations.xMoveMatrix;
            case 'x\'': return rotations.xPrimeMoveMatrix;
            case 'y': return rotations.yMoveMatrix;
            case 'y\'': return rotations.yPrimeMoveMatrix;
            case 'z': return rotations.zMoveMatrix;
            case 'z\'': return rotations.zPrimeMoveMatrix;
        }
    }

    const applyMoveMatrix = (state: Record<string, Color[]>, moveMatrix: MoveMatrix) => {
        const newState = {
            up: [...state.up],
            front: [...state.front],
            left: [...state.left],
            right: [...state.right],
            back: [...state.back],
            down: [...state.down]
        };
        
        // Apply the move matrix to the state
        for (const face of Object.keys(moveMatrix)) {
            const points = moveMatrix[face as keyof MoveMatrix];
            for (const point of points) {
                const pointIndex = points.indexOf(point);
                const { face: sourceFace, index: sourceIndex } = point;
                console.log(`${face}[${pointIndex}] = ${sourceFace}[${sourceIndex}] -> ${state[sourceFace][sourceIndex]}`);
                newState[face as keyof typeof newState][pointIndex] = state[sourceFace][sourceIndex];
            }
        }
        return newState;
    }

    const applyMove = (move: CubeAllMove) => {
        console.log('applyMove', move);
        const moveMatrix = chooseMoveMatrix(move);
        if (!moveMatrix) {
            throw new Error(`Move matrix for ${move} not found`);
        }
        const newState = applyMoveMatrix(cubeState, moveMatrix);
        setCubeState(newState);
    }

    return {
        applyMove,
        cubeMoves,
        cubeRotations,
        sliceMoves,
    }
}