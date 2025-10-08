import { useState } from 'react';

function App() {
  const [selectedColor, setSelectedColor] = useState('white');
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

  const renderFace = (faceName: string, faceColors: string[]) => {
    return (
      <div className="grid grid-cols-3 gap-1 w-24 h-24">
        {faceColors.map((color, index) => (
          <div
            key={index}
            className={`w-7 h-7 border border-gray-300 cursor-pointer ${
              color === 'white' ? 'bg-white' :
              color === 'yellow' ? 'bg-yellow-400' :
              color === 'red' ? 'bg-red-500' :
              color === 'orange' ? 'bg-orange-500' :
              color === 'green' ? 'bg-green-500' :
              color === 'blue' ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => {
              const newColors = [...faceColors];
              newColors[index] = selectedColor;
              setCubeState({...cubeState, [faceName]: newColors});
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="flex h-screen">
        {/* Main Cube Display - Left side */}
        <div className="flex-1 p-4">
          <div className="bg-gray-200 border border-gray-400 rounded p-4 h-full">
            {/* 2D Cube Representation - FacePaint equivalent */}
            <div className="bg-gray-100 border border-gray-400 rounded p-4" style={{width: '332px', height: '250px'}}>
              <div className="flex flex-col items-center space-y-2">
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
          </div>
        </div>

        {/* Control Panel - Right side (PageCtrl equivalent) */}
        <div className="w-80 bg-gray-100 border-l border-gray-400 p-4">
          <div className="bg-white border border-gray-400 rounded p-3 h-full">
            <h2 className="text-sm font-semibold mb-4 text-gray-700">Facelet Editor</h2>
            
            {/* Selected Color Label */}
            <div className="mb-4">
              <span className="text-sm font-semibold text-gray-700">Selected Color</span>
            </div>

            {/* GroupBoxes Row - Horizontal layout like original */}
            <div className="flex space-x-4 mb-4">
              {/* Apply Move GroupBox */}
              <div className="border border-gray-400 rounded p-3" style={{width: '120px', height: '104px'}}>
                <div className="text-xs font-semibold text-gray-700 mb-2">Apply Move</div>
                <div className="grid grid-cols-3 gap-1">
                  <button className="px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400">R</button>
                  <button className="px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400">U</button>
                  <button className="px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400">F</button>
                  <button className="px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400">D</button>
                  <button className="px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400">L</button>
                  <button className="px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400">B</button>
                  <button className="px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400">E</button>
                  <button className="px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400">S</button>
                  <button className="px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400">M</button>
                  <button className="px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400">x</button>
                  <button className="px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400">y</button>
                  <button className="px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400">z</button>
                </div>
              </div>

              {/* Reset To GroupBox */}
              <div className="border border-gray-400 rounded p-3" style={{width: '103px', height: '104px'}}>
                <div className="text-xs font-semibold text-gray-700 mb-2">Reset To</div>
                <div className="space-y-1">
                  <button className="w-full px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400">Empty</button>
                  <button className="w-full px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400">Clean</button>
                  <button className="w-full px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400">Random</button>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div className="border border-gray-400 rounded p-3 mb-4">
              <h3 className="text-xs font-semibold mb-2 text-gray-700">Color Selection</h3>
              <div className="grid grid-cols-2 gap-1">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`p-1 text-xs border ${
                      selectedColor === color.value 
                        ? 'border-blue-500 bg-blue-100' 
                        : 'border-gray-400 bg-gray-200'
                    } ${color.bg}`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Backend Connection */}
            <div className="border border-gray-400 rounded p-3 mb-4">
              <h3 className="text-xs font-semibold mb-2 text-gray-700">Test Backend</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    fetch('http://localhost:3001/api/health')
                      .then(res => res.json())
                      .then(data => alert('Backend OK: ' + JSON.stringify(data)))
                      .catch(err => alert('Backend Error: ' + err.message));
                  }}
                  className="w-full px-2 py-1 bg-blue-500 text-white text-xs border border-blue-600 hover:bg-blue-600"
                >
                  Test Backend Connection
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="text-xs text-gray-600 text-center">
              Ready to solve
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;