import ControlButton from "./ControlButton"
import { useScrambleContext } from "../hooks/useScrambleContext"
import { applyMove, cubeRotations } from "@cube-explorer/shared";
import { useCubeContext } from "../hooks/useContexts";

export const MoveCubeButtons = () => {
    const { cubeState, setCubeState } = useCubeContext();
    const { appendToScramble } = useScrambleContext();

    const handleMove = (move: string) => {
        applyMove(cubeState, move);
        setCubeState(cubeState)
        appendToScramble(move);
    };
    return (
        <>
         <div className="border border-gray-400 rounded p-3 flex-1">
              <div className="flex space-x-6">
                {/* Apply Move Section */}
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-700 mb-3">Apply Move</div>
                  <div className="grid grid-cols-4 gap-1">
                    {/* Row 1: R R' L L' */}
                    <ControlButton label="R" onClick={() => handleMove('R')} />
                    <ControlButton label="R'" onClick={() => handleMove('R\'')} />
                    <ControlButton label="L" onClick={() => handleMove('L')} />
                    <ControlButton label="L'" onClick={() => handleMove('L\'')} />
                    
                    {/* Row 2: U U' D D' */}
                    <ControlButton label="U" onClick={() => handleMove('U')} />
                    <ControlButton label="U'" onClick={() => handleMove('U\'')} />
                    <ControlButton label="D" onClick={() => handleMove('D')} />
                    <ControlButton label="D'" onClick={() => handleMove('D\'')} />
                    
                    {/* Row 3: F F' B B' */}
                    <ControlButton label="F" onClick={() => handleMove('F')} />
                    <ControlButton label="F'" onClick={() => handleMove('F\'')} />
                    <ControlButton label="B" onClick={() => handleMove('B')} />
                    <ControlButton label="B'" onClick={() => handleMove('B\'')} />
                  </div>
                </div>
                
                {/* Slice moves Section */}
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-700 mb-3">Slice Moves</div>
                  <div className="grid grid-cols-2 gap-1">
                    {/* Row 1: M M' */}
                    <ControlButton label="M" onClick={() => handleMove('M')} />
                    <ControlButton label="M'" onClick={() => handleMove('M\'')} />
                    
                    {/* Row 2: E E' */}
                    <ControlButton label="E" onClick={() => handleMove('E')} />
                    <ControlButton label="E'" onClick={() => handleMove('E\'')} />
                    
                    {/* Row 3: S S' */}
                    <ControlButton label="S" onClick={() => handleMove('S')} />
                    <ControlButton label="S'" onClick={() => handleMove('S\'')} />
                  </div>
                </div>

                {/* Whole cube rotations Section */}
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-700 mb-3">Rotations</div>
                  <div className="grid grid-cols-2 gap-1">
                    {cubeRotations.map(move => (
                      <ControlButton key={move} label={move} onClick={() => handleMove(move)} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
        </>
    )
}
