import useCubeMoves from "./useCubeMoves";
import { useCubeContext } from "./useContexts";

export const useScramble = () => {
    const { cubeState, setCubeState } = useCubeContext();
    const { applyMoveMatrix, chooseMoveMatrix, cubeMoves, cubeRotations, sliceMoves } = useCubeMoves();
    const allValidMoves = [...cubeMoves, ...cubeRotations, ...sliceMoves];

    const parseScramble = (scramble: string): string[] => {
        return scramble.trim().split(/\s+/).filter(move => move.length > 0);
      };

    const isValidScramble = (scramble: string): boolean => {
        if (!scramble.trim()) return false;
        const moves = parseScramble(scramble);
        return moves.every(move => allValidMoves.includes(move));
    }

    const applyScramble = (scramble: string) => {
        if (!isValidScramble(scramble)) return;
        const moves = parseScramble(scramble);
        // Build the final state progressively
        let currentState = {
            up: [...cubeState.up],
            front: [...cubeState.front],
            left: [...cubeState.left],
            right: [...cubeState.right],
            back: [...cubeState.back],
            down: [...cubeState.down]
        };
        
        moves.forEach(move => {
            const moveMatrix = chooseMoveMatrix(move);
            if (moveMatrix) {
                currentState = applyMoveMatrix(currentState, moveMatrix);
            }
        });
        
        // Apply the final state
        setCubeState(currentState);
        console.log(`Applied scramble: ${scramble}`);
    }

    return {
        parseScramble,
        isValidScramble,
        applyScramble
    }
}