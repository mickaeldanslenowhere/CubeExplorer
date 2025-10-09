import useCubeMoves, { sliceMoves, cubeMoves } from "../hooks/useCubeMoves"

import { cubeRotations } from "../hooks/useCubeMoves"
import ControlButton from "./ControlButton"
import { Separator } from "./Separator"

export const MoveCubeButtons = () => {
    const { applyMove } = useCubeMoves();
    return (
        <>
         <div className="border border-gray-400 rounded p-3 flex-1">
              <div className="text-xs font-semibold text-gray-700 mb-3">Apply Move</div>
              <div className="grid grid-cols-3 gap-1">
                {cubeMoves.map(move => (
                  <ControlButton label={move} onClick={() => applyMove(move)} />
                ))}
              </div>
              
              {/* Separator */}
              <Separator />
              
              {/* Slice moves */}
              <div className="text-xs font-semibold text-gray-700 mb-2">Slice Moves</div>
              <div className="grid grid-cols-3 gap-1 mb-3">
                {sliceMoves.map(move => (
                  <ControlButton label={move} onClick={() => applyMove(move)} />
                ))}
              </div>

              <Separator />
              
              {/* Whole cube rotations */}
              <div className="text-xs font-semibold text-gray-700 mb-2">Whole Cube Rotations</div>
              <div className="grid grid-cols-3 gap-1">
                {cubeRotations.map(move => (
                  <ControlButton label={move} onClick={() => applyMove(move)} />
                ))}
              </div>
            </div>
        </>
    )
}
