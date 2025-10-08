import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

function App() {
  const [selectedColor, setSelectedColor] = useState('white');
  const [viewMode, setViewMode] = useState<'2d' | '3d-isometric' | '3d-rotating'>('2d');
  const [cubeState, setCubeState] = useState(() => {
    // Initialize solved cube state
    const faces = ['front', 'back', 'left', 'right', 'up', 'down'];
    const colors = ['red', 'orange', 'green', 'blue', 'white', 'yellow'];
    const state: any = {};
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

  // Helper function to get color class
  const getColorClass = (color: string) => {
    switch (color) {
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

  // Helper function to convert color names to hex values
  const getColorHex = (color: string) => {
    switch (color) {
      case 'white': return '#ffffff';
      case 'yellow': return '#fbbf24';
      case 'red': return '#ef4444';
      case 'orange': return '#f97316';
      case 'green': return '#22c55e';
      case 'blue': return '#3b82f6';
      default: return '#9ca3af';
    }
  };

  // Helper function to get face color for a specific position
  const getFaceColor = (face: string, position: number) => {
    return getColorHex(cubeState[face][position]);
  };

  // 3D Cube component for isometric view
  const Cube3DIsometric = () => {
    return (
      <group rotation={[0, Math.PI / 4, 0]}>
        <RubiksCube3x3 />
      </group>
    );
  };

  // 3x3x3 Rubik's Cube component
  const RubiksCube3x3 = () => {
    const cubeSize = 0.3;
    const spacing = 0.32;
    const offset = -spacing;

    return (
      <group>
        {/* Generate all 27 cubes (3x3x3) */}
        {Array.from({ length: 3 }, (_, x) =>
          Array.from({ length: 3 }, (_, y) =>
            Array.from({ length: 3 }, (_, z) => {
              const cubeX = x * spacing + offset;
              const cubeY = y * spacing + offset;
              const cubeZ = z * spacing + offset;

              return (
                <group key={`${x}-${y}-${z}`} position={[cubeX, cubeY, cubeZ]}>
                  {/* Front face (z = 1) */}
                  {z === 2 && (
                    <Box position={[0, 0, cubeSize/2 + 0.01]} args={[cubeSize, cubeSize, 0.01]}>
                      <meshStandardMaterial color={getFaceColor('front', x + y * 3)} />
                    </Box>
                  )}
                  {/* Back face (z = -1) */}
                  {z === 0 && (
                    <Box position={[0, 0, -cubeSize/2 - 0.01]} args={[cubeSize, cubeSize, 0.01]}>
                      <meshStandardMaterial color={getFaceColor('back', x + y * 3)} />
                    </Box>
                  )}
                  {/* Left face (x = -1) */}
                  {x === 0 && (
                    <Box position={[-cubeSize/2 - 0.01, 0, 0]} args={[0.01, cubeSize, cubeSize]}>
                      <meshStandardMaterial color={getFaceColor('left', z + y * 3)} />
                    </Box>
                  )}
                  {/* Right face (x = 1) */}
                  {x === 2 && (
                    <Box position={[cubeSize/2 + 0.01, 0, 0]} args={[0.01, cubeSize, cubeSize]}>
                      <meshStandardMaterial color={getFaceColor('right', z + y * 3)} />
                    </Box>
                  )}
                  {/* Up face (y = 1) */}
                  {y === 2 && (
                    <Box position={[0, cubeSize/2 + 0.01, 0]} args={[cubeSize, 0.01, cubeSize]}>
                      <meshStandardMaterial color={getFaceColor('up', x + z * 3)} />
                    </Box>
                  )}
                  {/* Down face (y = -1) */}
                  {y === 0 && (
                    <Box position={[0, -cubeSize/2 - 0.01, 0]} args={[cubeSize, 0.01, cubeSize]}>
                      <meshStandardMaterial color={getFaceColor('down', x + z * 3)} />
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

  // 3D Cube component for rotating view
  const Cube3DRotating = () => {
    return (
      <group>
        <Cube3DIsometric />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </group>
    );
  };

  const renderFace = (faceName: string, faceColors: string[]) => {
    return (
      <div className="grid grid-cols-3 gap-0.5 w-20 h-20">
        {faceColors.map((color, index) => {
          const isCenter = index === 4; // Center piece (index 4 in 3x3 grid)
          
          return (
            <div
              key={index}
              className={`w-6 h-6 border border-gray-300 cursor-pointer ${getColorClass(color)}`}
              onClick={() => {
                if (isCenter) {
                  // Center piece: select this color
                  setSelectedColor(color);
                } else {
                  // Edge/corner piece: change to selected color
                  const newColors = [...faceColors];
                  newColors[index] = selectedColor;
                  setCubeState({...cubeState, [faceName]: newColors});
                }
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="flex h-screen">
        {/* Main Cube Display - Left side */}
        <div className="flex-1 p-6">
          <div className="bg-gray-200 border border-gray-400 rounded p-6 h-full flex flex-col">
            {/* View Mode Selector */}
            <div className="mb-4 flex space-x-2">
              {createButton('2D Facelets', () => setViewMode('2d'), 
                `px-3 py-1 text-xs border rounded ${viewMode === '2d' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`)}
              {createButton('3D Isometric', () => setViewMode('3d-isometric'), 
                `px-3 py-1 text-xs border rounded ${viewMode === '3d-isometric' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`)}
              {createButton('3D Rotating', () => setViewMode('3d-rotating'), 
                `px-3 py-1 text-xs border rounded ${viewMode === '3d-rotating' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`)}
            </div>

            {/* Cube Display Area */}
            <div className="flex-1 flex items-center justify-center">
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

              {(viewMode === '3d-isometric' || viewMode === '3d-rotating') && (
                <div className="bg-gray-100 border border-gray-400 rounded" style={{width: '400px', height: '300px'}}>
                  <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    {viewMode === '3d-isometric' ? <Cube3DIsometric /> : <Cube3DRotating />}
                  </Canvas>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Control Panel - Right side */}
        <div className="w-80 bg-gray-100 border-l border-gray-400 p-4">
          <div className="bg-white border border-gray-400 rounded p-4 h-full flex flex-col">
            <h2 className="text-sm font-semibold mb-6 text-gray-700">Facelet Editor</h2>
            
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
                    } ${getColorClass(color.value)}`}
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
                  {['R', 'U', 'F', 'D', 'L', 'B', 'E', 'S', 'M', 'x', 'y', 'z'].map(move => 
                    createButton(move, () => console.log(`Move: ${move}`))
                  )}
                </div>
              </div>

              {/* Reset To GroupBox */}
              <div className="border border-gray-400 rounded p-3 flex-1">
                <div className="text-xs font-semibold text-gray-700 mb-3">Reset To</div>
                <div className="space-y-2">
                  {['Empty', 'Clean', 'Random'].map(action => 
                    createButton(action, () => console.log(`Reset: ${action}`), "w-full px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400")
                  )}
                </div>
              </div>
            </div>

            {/* Test Backend Section */}
            <div className="border border-gray-400 rounded p-3 mb-4">
              <h3 className="text-xs font-semibold mb-3 text-gray-700">Test Backend</h3>
              {createButton(
                'Test Backend Connection',
                () => {
                  fetch('http://localhost:3001/api/health')
                    .then(res => res.json())
                    .then(data => alert('Backend OK: ' + JSON.stringify(data)))
                    .catch(err => alert('Backend Error: ' + err.message));
                },
                "w-full px-3 py-2 bg-blue-500 text-white text-xs border border-blue-600 hover:bg-blue-600 rounded"
              )}
            </div>

            {/* Status */}
            <div className="text-xs text-gray-600 text-center mt-auto">
              Ready to solve
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;