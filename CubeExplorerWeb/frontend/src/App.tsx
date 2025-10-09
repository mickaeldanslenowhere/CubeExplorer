import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import { colors } from './hooks/useColors';
import ControlButton from './components/ControlButton';
import useViewMode from './hooks/useViewMode';
import { BackendStatus } from './components/BackendStatus';
import { MoveCubeButtons } from './components/MoveCubeButtons';
import { CubeFace } from './components/Cube2D/CubeFace';
import { CubeProvider } from './contexts/CubeContext';
import { ColorProvider } from './contexts/ColorContext';
import { useCubeContext, useColorContext } from './hooks/useContexts';
import { Cube2D } from './components/Cube2D/Cube2D';



function AppContent() {
  const { setSelectedColor } = useColorContext();
  const { defaultCubeState, cubeState, setCubeState } = useCubeContext();
  const { viewMode, setViewMode } = useViewMode();

  // Function to determine if a cubie should be rendered for the L-shape
  // Based on the image: bottom layer + top layer + left column of middle layer
  const isCubiePresent = (x: number, y: number, _z: number): boolean => { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Bottom layer (y=0) - all 9 cubies
    if (y === 0) return true;
    
    // Top layer (y=2) - all 9 cubies  
    if (y === 2) return true;
    
    // Middle layer (y=1) - only leftmost column (x=0)
    if (y === 1 && x === 0) return true;
    
    return false;
  };

  // Helper function to get the color for a specific facelet in 3D
  const getFaceColorFor3D = (state: Record<string, string[]>, faceName: string, x: number, y: number, z: number) => {
    let index: number;
    switch (faceName) {
      case 'up':
        index = x + (2 - z) * 3;
        break;
      case 'down':
        index = x + z * 3;
        break;
      case 'front':
        index = x + (2 - y) * 3;
        break;
      case 'back':
        index = (2 - x) + (2 - y) * 3;
        break;
      case 'left':
        index = z + (2 - y) * 3;
        break;
      case 'right':
        index = (2 - z) + (2 - y) * 3;
        break;
      default:
        return 'black';
    }
    return state[faceName][index] || 'black';
  };

  // Base 3x3x3 Rubik's Cube component (reusable for both 3D views)
  const RubiksCube3x3Base = ({ cubeStateFor3D, filterCubies = () => true }: { cubeStateFor3D: Record<string, string[]>, filterCubies?: (x: number, y: number, z: number) => boolean }) => {
    const cubeSize = 0.3;
    const spacing = 0.32;
    const offset = -spacing;

    return (
      <group>
        {Array.from({ length: 3 }, (_, x) =>
          Array.from({ length: 3 }, (_, y) =>
            Array.from({ length: 3 }, (_, z) => {
              if (!filterCubies(x, y, z)) return null;

              const cubeX = x * spacing + offset;
              const cubeY = y * spacing + offset;
              const cubeZ = z * spacing + offset;

              return (
                <group key={`${x}-${y}-${z}`} position={[cubeX, cubeY, cubeZ]}>
                  {/* Front face (z = 2) */}
                  {z === 2 && (
                    <Box position={[0, 0, cubeSize/2 + 0.01]} args={[cubeSize, cubeSize, 0.01]}>
                      <meshStandardMaterial color={getFaceColorFor3D(cubeStateFor3D, 'front', x, y, z)} />
                    </Box>
                  )}
                  {/* Back face (z = 0) */}
                  {z === 0 && (
                    <Box position={[0, 0, -cubeSize/2 - 0.01]} args={[cubeSize, cubeSize, 0.01]}>
                      <meshStandardMaterial color={getFaceColorFor3D(cubeStateFor3D, 'back', x, y, z)} />
                    </Box>
                  )}
                  {/* Left face (x = 0) */}
                  {x === 0 && (
                    <Box position={[-cubeSize/2 - 0.01, 0, 0]} args={[0.01, cubeSize, cubeSize]}>
                      <meshStandardMaterial color={getFaceColorFor3D(cubeStateFor3D, 'left', x, y, z)} />
                    </Box>
                  )}
                  {/* Right face (x = 2) */}
                  {x === 2 && (
                    <Box position={[cubeSize/2 + 0.01, 0, 0]} args={[0.01, cubeSize, cubeSize]}>
                      <meshStandardMaterial color={getFaceColorFor3D(cubeStateFor3D, 'right', x, y, z)} />
                    </Box>
                  )}
                  {/* Up face (y = 2) */}
                  {y === 2 && (
                    <Box position={[0, cubeSize/2 + 0.01, 0]} args={[cubeSize, 0.01, cubeSize]}>
                      <meshStandardMaterial color={getFaceColorFor3D(cubeStateFor3D, 'up', x, y, z)} />
                    </Box>
                  )}
                  {/* Down face (y = 0) */}
                  {y === 0 && (
                    <Box position={[0, -cubeSize/2 - 0.01, 0]} args={[cubeSize, 0.01, cubeSize]}>
                      <meshStandardMaterial color={getFaceColorFor3D(cubeStateFor3D, 'down', x, y, z)} />
                    </Box>
                  )}
                  {/* Core cube (always black) */}
                  <Box args={[cubeSize, cubeSize, cubeSize]}>
                    <meshStandardMaterial color="#333333" />
                  </Box>
                </group>
              );
            })
          )
        )}
      </group>
    );
  };

  // 3D Cube component for isometric view (L-shape from image)
  const Cube3DIsometric = () => {
    return (
      <group rotation={[Math.PI / 6, Math.PI / 4, 0]}> {/* Better isometric rotation */}
        <RubiksCube3x3Base cubeStateFor3D={cubeState} filterCubies={isCubiePresent} />
      </group>
    );
  };

  // 3x3x3 Rubik's Cube component for rotating view
  const RubiksCube3x3 = ({ cubeState }: { cubeState: Record<string, string[]> }) => {
    return (
      <RubiksCube3x3Base cubeStateFor3D={cubeState} />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2">
      <div className="bg-white shadow-lg rounded-lg flex w-full max-w-6xl">
        {/* Main Cube Display - Left side */}
        <div className="flex-1 p-4 flex flex-col">
          {/* View Mode Selector */}
          <div className="mb-4 flex justify-center space-x-2">
            <ControlButton label="2D Facelets" onClick={() => setViewMode('2d')} />
            <ControlButton label="3D Isometric" onClick={() => setViewMode('3d-isometric')} />
            <ControlButton label="3D Rotating" onClick={() => setViewMode('3d-rotating')} />
          </div>

          <div className="bg-gray-200 border border-gray-400 rounded p-6 h-full flex items-center justify-center">
            {viewMode === '2d' && (
              <Cube2D />
            )}

            {viewMode === '3d-isometric' && (
              <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Cube3DIsometric />
              </Canvas>
            )}

            {viewMode === '3d-rotating' && (
              <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <RubiksCube3x3 cubeState={cubeState} />
                <OrbitControls />
              </Canvas>
            )}
          </div>
        </div>

        {/* Control Panel - Right side */}
        <div className="w-80 p-4 border-l border-gray-300 flex flex-col">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Cube Explorer</h2>

          <BackendStatus />

          {/* Selected Color Section */}
          <div className="mb-6">
            <span className="text-sm font-semibold text-gray-700 block mb-3">Selected Color</span>
            <div className="grid grid-cols-2 gap-2">
              {colors.map((color) => (
                <ControlButton label={color.name} onClick={() => setSelectedColor(color.value)} />
              ))}
            </div>
          </div>

          {/* Apply Move and Reset To Section */}
          <div className="flex space-x-4 mb-6">
            {/* Apply Move GroupBox */}
            <MoveCubeButtons />

            {/* Reset To GroupBox */}
            <div className="border border-gray-400 rounded p-3 w-1/3">
              <div className="text-xs font-semibold text-gray-700 mb-3">Reset To</div>
              <div className="space-y-1">
                <ControlButton label="Empty" onClick={() => {/* TODO: Implement empty cube */}} />
                <ControlButton label="Clean" onClick={() => setCubeState(defaultCubeState)} />
                <ControlButton label="Random" onClick={() => {/* TODO: Implement random cube */}} />
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="text-xs text-gray-600 text-center">
            Ready to solve
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <CubeProvider>
      <ColorProvider>
        <AppContent />
      </ColorProvider>
    </CubeProvider>
  );
}

export default App;