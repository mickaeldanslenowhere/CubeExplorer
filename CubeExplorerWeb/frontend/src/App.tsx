import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

function App() {
  const [selectedColor, setSelectedColor] = useState('white');
  const [viewMode, setViewMode] = useState<'2d' | '3d-isometric' | '3d-rotating'>('2d');
  const [cubeState, setCubeState] = useState<Record<string, string[]>>(() => {
    // Initialize solved cube state
    const faces = ['front', 'back', 'left', 'right', 'up', 'down'];
    const colors = ['red', 'orange', 'green', 'blue', 'white', 'yellow'];
    const state: Record<string, string[]> = {};
    faces.forEach((face, index) => {
      state[face] = Array(9).fill(colors[index]);
    });
    return state;
  });

  const colors = [
    { name: 'White', value: 'white', bg: 'bg-white' },
    { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-400' },
    { name: 'Red', value: 'red', bg: 'bg-red-500' },
    { name: 'Orange', value: 'orange', bg: 'bg-orange-500' },
    { name: 'Green', value: 'green', bg: 'bg-green-500' },
    { name: 'Blue', value: 'blue', bg: 'bg-blue-500' }
  ];

  // Helper function to get Tailwind CSS class for a color
  const getColorClass = (colorName: string) => {
    switch (colorName) {
      case 'white': return 'bg-white';
      case 'yellow': return 'bg-yellow-400';
      case 'red': return 'bg-red-500';
      case 'orange': return 'bg-orange-500';
      case 'green': return 'bg-green-500';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  // Helper function to create button
  const createButton = (text: string, onClick: () => void, className: string = "px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400") => (
    <button className={className} onClick={onClick}>
      {text}
    </button>
  );

  // Define static isometric cube state - solved cube with consistent colors
  const staticIsometricCubeState = {
    front: Array(9).fill('red'),    // All red
    back: Array(9).fill('orange'),  // All orange  
    left: Array(9).fill('green'),   // All green
    right: Array(9).fill('blue'),    // All blue
    up: Array(9).fill('white'),     // All white
    down: Array(9).fill('yellow'),   // All yellow
  };

  // Function to determine if a cubie should be rendered for the L-shape
  // Based on the image: bottom layer + top layer + left column of middle layer
  const isCubiePresent = (x: number, y: number, _z: number): boolean => {
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
        <RubiksCube3x3Base cubeStateFor3D={staticIsometricCubeState} filterCubies={isCubiePresent} />
      </group>
    );
  };

  // 3x3x3 Rubik's Cube component for rotating view
  const RubiksCube3x3 = ({ cubeState }: { cubeState: Record<string, string[]> }) => {
    return (
      <RubiksCube3x3Base cubeStateFor3D={cubeState} />
    );
  };

  // Helper function to render a single face of the 2D cube
  const renderFace = (faceName: string, faceColors: string[]) => {
    return (
      <div className="grid grid-cols-3 gap-0.5 w-20 h-20">
        {faceColors.map((color, index) => (
          <div
            key={index}
            className={`w-6 h-6 border border-gray-300 cursor-pointer ${getColorClass(color)}`}
            onClick={() => {
              // If it's a center facelet (index 4), select its color
              if (index === 4) {
                setSelectedColor(color);
                console.log(`Selected color from center facelet: ${color}`);
              } else {
                // Otherwise, change the facelet's color
                const newColors = [...faceColors];
                newColors[index] = selectedColor;
                setCubeState({...cubeState, [faceName]: newColors});
                console.log(`Updated ${faceName} face at position ${index} to ${selectedColor}`);
              }
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg flex w-full max-w-4xl">
        {/* Main Cube Display - Left side */}
        <div className="flex-1 p-6 flex flex-col">
          {/* View Mode Selector */}
          <div className="mb-4 flex justify-center space-x-2">
            {createButton('2D Facelets', () => setViewMode('2d'), `px-4 py-2 text-sm rounded ${viewMode === '2d' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`)}
            {createButton('3D Isometric', () => setViewMode('3d-isometric'), `px-4 py-2 text-sm rounded ${viewMode === '3d-isometric' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`)}
            {createButton('3D Rotating', () => setViewMode('3d-rotating'), `px-4 py-2 text-sm rounded ${viewMode === '3d-rotating' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`)}
          </div>

          <div className="bg-gray-200 border border-gray-400 rounded p-6 h-full flex items-center justify-center">
            {viewMode === '2d' && (
              <div className="bg-gray-100 border border-gray-400 rounded p-4" style={{width: '400px', height: '300px'}}>
                <div className="flex flex-col items-center space-y-2 h-full justify-center">
                  {/* Up Face */}
                  <div className="flex justify-center">
                    {renderFace('up', cubeState.up)}
                  </div>
                  
                  {/* Middle Row: Left, Front, Right, Back */}
                  <div className="flex space-x-2">
                    {renderFace('left', cubeState.left)}
                    {renderFace('front', cubeState.front)}
                    {renderFace('right', cubeState.right)}
                    {renderFace('back', cubeState.back)}
                  </div>
                  
                  {/* Down Face */}
                  <div className="flex justify-center">
                    {renderFace('down', cubeState.down)}
                  </div>
                </div>
              </div>
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
        <div className="w-80 p-6 border-l border-gray-300 flex flex-col">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Cube Explorer</h2>

          {/* Connection Status */}
          <div className="border border-gray-400 rounded p-3 mb-4">
            <h3 className="text-xs font-semibold mb-2 text-gray-700">Connection Status</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">
                Connected to backend
              </span>
            </div>
          </div>

          {/* Test Backend Section */}
          <div className="border border-gray-400 rounded p-3 mb-4">
            <h3 className="text-xs font-semibold mb-3 text-gray-700">Test Backend</h3>
            {createButton(
              "Test Backend Connection",
              () => {
                fetch('http://localhost:3001/api/health')
                  .then(res => res.json())
                  .then(data => alert('Backend OK: ' + JSON.stringify(data)))
                  .catch(err => alert('Backend Error: ' + err.message));
              },
              "w-full px-3 py-2 bg-blue-500 text-white text-xs border border-blue-600 hover:bg-blue-600 rounded"
            )}
          </div>

          {/* Selected Color Section */}
          <div className="mb-6">
            <span className="text-sm font-semibold text-gray-700 block mb-3">Selected Color</span>
            <div className="grid grid-cols-2 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`p-2 text-xs border rounded ${
                    selectedColor === color.value 
                      ? 'border-blue-500 bg-blue-100' 
                      : 'border-gray-400 hover:bg-gray-300'
                  } ${getColorClass(color.value)}`} // Use getColorClass here
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Move and Reset To Section */}
          <div className="flex space-x-4 mb-6">
            {/* Apply Move GroupBox */}
            <div className="border border-gray-400 rounded p-3 flex-1">
              <div className="text-xs font-semibold text-gray-700 mb-3">Apply Move</div>
              <div className="grid grid-cols-3 gap-1">
                {['R', 'U', 'F', 'D', 'L', 'B', 'E', 'S', 'M', 'x', 'y', 'z'].map(move => (
                  createButton(move, () => console.log(`Apply move: ${move}`))
                ))}
              </div>
            </div>

            {/* Reset To GroupBox */}
            <div className="border border-gray-400 rounded p-3 w-1/3">
              <div className="text-xs font-semibold text-gray-700 mb-3">Reset To</div>
              <div className="space-y-1">
                {createButton(
                  "Empty",
                  () => {/* TODO: Implement empty cube */},
                  "w-full px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400"
                )}
                {createButton(
                  "Clean",
                  () => setCubeState(() => {
                    const faces = ['front', 'back', 'left', 'right', 'up', 'down'];
                    const colors = ['red', 'orange', 'green', 'blue', 'white', 'yellow'];
                    const state: Record<string, string[]> = {};
                    faces.forEach((face, index) => {
                      state[face] = Array(9).fill(colors[index]);
                    });
                    return state;
                  }),
                  "w-full px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400"
                )}
                {createButton(
                  "Random",
                  () => {/* TODO: Implement random cube */},
                  "w-full px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400"
                )}
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

export default App;