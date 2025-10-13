import { CubeFace } from "./CubeFace"

export const Cube3DIsometric = () => {
    return (
        <div className="bg-gray-100 border border-gray-400 rounded p-4" style={{width: '334px', height: '260px'}}>
                <div className="grid grid-rows-3 grid-cols-4 h-full justify-center items-center">
                  {/* Row 1: Empty, Up, Empty, Empty */}
                  <div></div>
                  <div className="flex justify-center">
                    <div className="transform rotate-0">
                      <CubeFace face="up" />
                    </div>
                  </div>
                  <div></div>
                  <div></div>
                  
                  {/* Row 2: Left, Front, Right, Back */}
                  <div className="flex justify-center">
                    <div className="transform rotate-180">
                      <CubeFace face="left" />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="transform rotate-0">
                      <CubeFace face="front" />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="transform rotate-0">
                      <CubeFace face="right" />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="transform rotate-180">
                      <CubeFace face="back" />
                    </div>
                  </div>
                  
                  {/* Row 3: Empty, Down, Empty, Empty */}
                  <div></div>
                  <div className="flex justify-center">
                    <div className="transform rotate-0">
                      <CubeFace face="down" />
                    </div>
                  </div>
                  <div></div>
                  <div></div>
                </div>
              </div>
    )
}