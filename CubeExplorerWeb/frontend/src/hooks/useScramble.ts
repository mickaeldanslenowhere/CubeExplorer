import useCubeMoves from "./useCubeMoves";
import { useCubeContext } from "./useContexts";

export const useScramble = () => {
    const { defaultCubeState, setCubeState } = useCubeContext();
    const { applyMoveMatrix, chooseMoveMatrix, cubeMoves, cubeRotations, sliceMoves } = useCubeMoves();
    const allValidMoves = [...cubeMoves, ...cubeRotations, ...sliceMoves];

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
        if (!scramble.trim()) return false;
        const moves = parseScramble(scramble);
        return moves.every(move => allValidMoves.includes(move));
    }

    const applyScramble = (scramble: string) => {
        if (!isValidScramble(scramble)) return;
        const moves = parseScramble(scramble);
        // Build the final state progressively
        let currentState = {
            up: [...defaultCubeState.up],
            front: [...defaultCubeState.front],
            left: [...defaultCubeState.left],
            right: [...defaultCubeState.right],
            back: [...defaultCubeState.back],
            down: [...defaultCubeState.down]
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