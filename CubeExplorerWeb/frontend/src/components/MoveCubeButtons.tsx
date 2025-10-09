import useCubeMoves from "../hooks/useCubeMoves"
import { cubeRotations } from "../hooks/useCubeMoves"
import ControlButton from "./ControlButton"

export const MoveCubeButtons = () => {
    const { applyMove } = useCubeMoves();
    return (
        <>
         <div className="border border-gray-400 rounded p-3 flex-1">
              <div className="flex space-x-6">
                {/* Apply Move Section */}
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-700 mb-3">Apply Move</div>
                  <div className="grid grid-cols-4 gap-1">
                    {/* Row 1: R R' L L' */}
                    <ControlButton label="R" onClick={() => applyMove('R')} />
                    <ControlButton label="R'" onClick={() => applyMove('R\'')} />
                    <ControlButton label="L" onClick={() => applyMove('L')} />
                    <ControlButton label="L'" onClick={() => applyMove('L\'')} />
                    
                    {/* Row 2: U U' D D' */}
                    <ControlButton label="U" onClick={() => applyMove('U')} />
                    <ControlButton label="U'" onClick={() => applyMove('U\'')} />
                    <ControlButton label="D" onClick={() => applyMove('D')} />
                    <ControlButton label="D'" onClick={() => applyMove('D\'')} />
                    
                    {/* Row 3: F F' B B' */}
                    <ControlButton label="F" onClick={() => applyMove('F')} />
                    <ControlButton label="F'" onClick={() => applyMove('F\'')} />
                    <ControlButton label="B" onClick={() => applyMove('B')} />
                    <ControlButton label="B'" onClick={() => applyMove('B\'')} />
                  </div>
                </div>
                
                {/* Slice moves Section */}
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-700 mb-3">Slice Moves</div>
                  <div className="grid grid-cols-2 gap-1">
                    {/* Row 1: M M' */}
                    <ControlButton label="M" onClick={() => applyMove('M')} />
                    <ControlButton label="M'" onClick={() => applyMove('M\'')} />
                    
                    {/* Row 2: E E' */}
                    <ControlButton label="E" onClick={() => applyMove('E')} />
                    <ControlButton label="E'" onClick={() => applyMove('E\'')} />
                    
                    {/* Row 3: S S' */}
                    <ControlButton label="S" onClick={() => applyMove('S')} />
                    <ControlButton label="S'" onClick={() => applyMove('S\'')} />
                  </div>
                </div>

                {/* Whole cube rotations Section */}
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-700 mb-3">Rotations</div>
                  <div className="grid grid-cols-2 gap-1">
                    {cubeRotations.map(move => (
                      <ControlButton key={move} label={move} onClick={() => applyMove(move)} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
        </>
    )
}
