import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

function App() {
  const [selectedColor, setSelectedColor] = useState('white');
  const [viewMode, setViewMode] = useState<'2d' | '3d-isometric' | '3d-rotating'>('2d');
  const [cubeState, setCubeState] = useState<Record<string, string[]>>(() => {
    // Initialize solved cube state with correct colors
    // U: White, F: Green, L: Orange, R: Red, B: Blue, D: Yellow
    const state: Record<string, string[]> = {
      up: Array(9).fill('white'),      // U: White
      front: Array(9).fill('green'),   // F: Green  
      left: Array(9).fill('orange'),   // L: Orange
      right: Array(9).fill('red'),     // R: Red
      back: Array(9).fill('blue'),      // B: Blue
      down: Array(9).fill('yellow')    // D: Yellow
    };
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

  // Apply a Rubik's Cube move to the cube state
  const applyMove = (move: string) => {
    const newState = { ...cubeState };
    
    switch (move) {
      case 'R': {
        // R move: rotate right face clockwise
        newState.right = [newState.right[6], newState.right[3], newState.right[0], newState.right[7], newState.right[4], newState.right[1], newState.right[8], newState.right[5], newState.right[2]];
        
        // Save original values before modification
        const originalUp = [...newState.up];
        const originalFront = [...newState.front];
        const originalDown = [...newState.down];
        const originalBack = [...newState.back];
        
        // R move: up right column -> back left column (reversed)
        newState.back[0] = originalUp[2];
        newState.back[3] = originalUp[5];
        newState.back[6] = originalUp[8];
        
        // back left column -> down right column (reversed)
        newState.down[2] = originalBack[6];
        newState.down[5] = originalBack[3];
        newState.down[8] = originalBack[0];
        
        // down right column -> front right column
        newState.front[2] = originalDown[2];
        newState.front[5] = originalDown[5];
        newState.front[8] = originalDown[8];
        
        // front right column -> up right column
        newState.up[2] = originalFront[2];
        newState.up[5] = originalFront[5];
        newState.up[8] = originalFront[8];
        break;
      }
        
      case 'U': {
        // U move: rotate up face clockwise
        newState.up = [newState.up[6], newState.up[3], newState.up[0], newState.up[7], newState.up[4], newState.up[1], newState.up[8], newState.up[5], newState.up[2]];
        
        // Update adjacent faces
        const frontTop = [newState.front[0], newState.front[1], newState.front[2]];
        const rightTop = [newState.right[0], newState.right[1], newState.right[2]];
        const backTop = [newState.back[0], newState.back[1], newState.back[2]];
        const leftTop = [newState.left[0], newState.left[1], newState.left[2]];
        
        // Front top becomes right top
        newState.front[0] = rightTop[0];
        newState.front[1] = rightTop[1];
        newState.front[2] = rightTop[2];
        
        // Right top becomes back top
        newState.right[0] = backTop[0];
        newState.right[1] = backTop[1];
        newState.right[2] = backTop[2];
        
        // Back top becomes left top
        newState.back[0] = leftTop[0];
        newState.back[1] = leftTop[1];
        newState.back[2] = leftTop[2];
        
        // Left top becomes front top
        newState.left[0] = frontTop[0];
        newState.left[1] = frontTop[1];
        newState.left[2] = frontTop[2];
        break;
      }
        
      case 'F': {
        // F move: rotate front face clockwise
        newState.front = [newState.front[6], newState.front[3], newState.front[0], newState.front[7], newState.front[4], newState.front[1], newState.front[8], newState.front[5], newState.front[2]];
        
        // Save original values before modification
        const originalUp = [...newState.up];
        const originalRight = [...newState.right];
        const originalDown = [...newState.down];
        const originalLeft = [...newState.left];
        
        // F move: up bottom row -> right left column
        newState.right[0] = originalUp[6];
        newState.right[3] = originalUp[7];
        newState.right[6] = originalUp[8];
        
        // right left column -> down top row (reversed)
        newState.down[0] = originalRight[6];
        newState.down[1] = originalRight[3];
        newState.down[2] = originalRight[0];
        
        // down top row -> left right column (reversed)
        newState.left[2] = originalDown[0];
        newState.left[5] = originalDown[1];
        newState.left[8] = originalDown[2];
        
        // left right column -> up bottom row
        newState.up[6] = originalLeft[8];
        newState.up[7] = originalLeft[5];
        newState.up[8] = originalLeft[2];
        break;
      }
        
      case 'D': {
        // D move: rotate down face clockwise
        newState.down = [newState.down[6], newState.down[3], newState.down[0], newState.down[7], newState.down[4], newState.down[1], newState.down[8], newState.down[5], newState.down[2]];
        
        // Update adjacent faces
        const frontBottom = [newState.front[6], newState.front[7], newState.front[8]];
        const leftBottom = [newState.left[6], newState.left[7], newState.left[8]];
        const backBottom = [newState.back[6], newState.back[7], newState.back[8]];
        const rightBottom = [newState.right[6], newState.right[7], newState.right[8]];
        
        // Front bottom becomes left bottom
        newState.front[6] = leftBottom[0];
        newState.front[7] = leftBottom[1];
        newState.front[8] = leftBottom[2];
        
        // Left bottom becomes back bottom
        newState.left[6] = backBottom[0];
        newState.left[7] = backBottom[1];
        newState.left[8] = backBottom[2];
        
        // Back bottom becomes right bottom
        newState.back[6] = rightBottom[0];
        newState.back[7] = rightBottom[1];
        newState.back[8] = rightBottom[2];
        
        // Right bottom becomes front bottom
        newState.right[6] = frontBottom[0];
        newState.right[7] = frontBottom[1];
        newState.right[8] = frontBottom[2];
        break;
      }
        
      case 'L': {
        // L move: rotate left face clockwise
        newState.left = [newState.left[6], newState.left[3], newState.left[0], newState.left[7], newState.left[4], newState.left[1], newState.left[8], newState.left[5], newState.left[2]];
        
        // Save original values before modification
        const originalUp = [...newState.up];
        const originalFront = [...newState.front];
        const originalDown = [...newState.down];
        const originalBack = [...newState.back];
        
        // L move: front left column -> up left column
        newState.front[0] = originalUp[0];
        newState.front[3] = originalUp[3];
        newState.front[6] = originalUp[6];
        
        // up left column -> back right column (reversed)
        newState.up[0] = originalBack[2];
        newState.up[3] = originalBack[5];
        newState.up[6] = originalBack[8];
        
        // back right column -> down left column (reversed)
        newState.back[2] = originalDown[0];
        newState.back[5] = originalDown[3];
        newState.back[8] = originalDown[6];
        
        // down left column -> front left column
        newState.down[0] = originalFront[0];
        newState.down[3] = originalFront[3];
        newState.down[6] = originalFront[6];
        break;
      }
        
      case 'B': {
        // B move: rotate back face clockwise
        newState.back = [newState.back[6], newState.back[3], newState.back[0], newState.back[7], newState.back[4], newState.back[1], newState.back[8], newState.back[5], newState.back[2]];
        
        // Save original values before modification
        const originalUp = [...newState.up];
        const originalLeft = [...newState.left];
        const originalDown = [...newState.down];
        const originalRight = [...newState.right];
        
        // B move: up top row -> left left column
        newState.left[0] = originalUp[0];
        newState.left[3] = originalUp[1];
        newState.left[6] = originalUp[2];
        
        // left left column -> down bottom row
        newState.down[6] = originalLeft[0];
        newState.down[7] = originalLeft[3];
        newState.down[8] = originalLeft[6];
        
        // down bottom row -> right right column (reversed)
        newState.right[2] = originalDown[8];
        newState.right[5] = originalDown[7];
        newState.right[8] = originalDown[6];
        
        // right right column -> up top row (reversed)
        newState.up[0] = originalRight[8];
        newState.up[1] = originalRight[5];
        newState.up[2] = originalRight[2];
        break;
      }
    }
    
    setCubeState(newState);
    console.log(`Applied move: ${move}`);
  };


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
                  createButton(move, () => applyMove(move))
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
                    // U: White, F: Green, L: Orange, R: Red, B: Blue, D: Yellow
                    return {
                      up: Array(9).fill('white'),      // U: White
                      front: Array(9).fill('green'),   // F: Green  
                      left: Array(9).fill('orange'),   // L: Orange
                      right: Array(9).fill('red'),     // R: Red
                      back: Array(9).fill('blue'),      // B: Blue
                      down: Array(9).fill('yellow')    // D: Yellow
                    };
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