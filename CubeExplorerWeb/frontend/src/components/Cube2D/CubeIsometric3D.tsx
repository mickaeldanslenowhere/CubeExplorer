import { CubeFaces } from "@cube-explorer/shared/src/cube/CubeFace"
import { Cube2DFace } from "./Cube2DFace"

export const Cube3DIsometric = () => {
    return (
        <div className="bg-gray-100 border border-gray-400 rounded p-4" style={{width: '334px', height: '260px'}}>
                <div className="grid grid-rows-3 grid-cols-4 h-full justify-center items-center">
                  {/* Row 1: Empty, Up, Empty, Empty */}
                  <div></div>
                  <div className="flex justify-center">
                    <div className="transform rotate-0">
                      <Cube2DFace face={CubeFaces.UP} />
                    </div>
                  </div>
                  <div></div>
                  <div></div>
                  
                  {/* Row 2: Left, Front, Right, Back */}
                  <div className="flex justify-center">
                    <div className="transform rotate-180">
                      <Cube2DFace face={CubeFaces.LEFT} />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="transform rotate-0">
                      <Cube2DFace face={CubeFaces.FRONT} />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="transform rotate-0">
                      <Cube2DFace face={CubeFaces.RIGHT} />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="transform rotate-180">
                      <Cube2DFace face={CubeFaces.BACK} />
                    </div>
                  </div>
                  
                  {/* Row 3: Empty, Down, Empty, Empty */}
                  <div></div>
                  <div className="flex justify-center">
                    <div className="transform rotate-0">
                      <Cube2DFace face={CubeFaces.DOWN} />
                    </div>
                  </div>
                  <div></div>
                  <div></div>
                </div>
              </div>
    )
}