import React, { useState } from 'react';

interface ControlPanelProps {
  onScramble: () => void;
  onSolve: () => void;
  onReset: () => void;
  onMove: (move: string) => void;
  isSolving: boolean;
  isScrambling: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onScramble,
  onSolve,
  onReset,
  onMove,
  isSolving,
  isScrambling
}) => {
  const [selectedFace, setSelectedFace] = useState<string>('');

  const faces = [
    { id: 'F', name: 'Front', color: 'bg-red-500' },
    { id: 'B', name: 'Back', color: 'bg-orange-500' },
    { id: 'L', name: 'Left', color: 'bg-green-500' },
    { id: 'R', name: 'Right', color: 'bg-blue-500' },
    { id: 'U', name: 'Up', color: 'bg-white' },
    { id: 'D', name: 'Down', color: 'bg-yellow-500' }
  ];

  const directions = [
    { id: '', name: 'Clockwise', symbol: '' },
    { id: "'", name: 'Counter-clockwise', symbol: "'" },
    { id: '2', name: 'Double', symbol: '2' }
  ];

  const handleMove = (face: string, direction: string) => {
    const move = face + direction;
    onMove(move);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Cube Controls</h3>
      
      {/* Face Selection */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 text-gray-700">Select Face</h4>
        <div className="grid grid-cols-3 gap-2">
          {faces.map((face) => (
            <button
              key={face.id}
              onClick={() => setSelectedFace(face.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedFace === face.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className={`w-8 h-8 mx-auto mb-2 rounded ${face.color} border`}></div>
              <span className="text-sm font-medium">{face.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Direction Selection */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 text-gray-700">Select Direction</h4>
        <div className="grid grid-cols-3 gap-2">
          {directions.map((dir) => (
            <button
              key={dir.id}
              onClick={() => selectedFace && handleMove(selectedFace, dir.id)}
              disabled={!selectedFace}
              className={`p-3 rounded-lg border-2 transition-all ${
                !selectedFace
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <span className="text-lg font-bold">{dir.symbol || '↻'}</span>
              <div className="text-sm">{dir.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onScramble}
          disabled={isScrambling || isSolving}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
            isScrambling || isSolving
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          {isScrambling ? 'Scrambling...' : 'Scramble Cube'}
        </button>

        <button
          onClick={onSolve}
          disabled={isSolving || isScrambling}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
            isSolving || isScrambling
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isSolving ? 'Solving...' : 'Solve Cube'}
        </button>

        <button
          onClick={onReset}
          disabled={isSolving || isScrambling}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
            isSolving || isScrambling
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          Reset Cube
        </button>
      </div>

      {/* Quick Move Buttons */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-3 text-gray-700">Quick Moves</h4>
        <div className="grid grid-cols-2 gap-2">
          {['R', 'L', 'U', 'D', 'F', 'B'].map((face) => (
            <div key={face} className="flex gap-1">
              <button
                onClick={() => onMove(face)}
                className="flex-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium"
              >
                {face}
              </button>
              <button
                onClick={() => onMove(face + "'")}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
              >
                {face}'
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
