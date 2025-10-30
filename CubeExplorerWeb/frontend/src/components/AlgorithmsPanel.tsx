import React from 'react';
import ControlButton from './ControlButton';

interface AlgorithmSet {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const blindMethods: AlgorithmSet[] = [
  {
    id: 'op',
    name: 'OP',
    description: 'Old Pochmann method for corners and edges',
    icon: '👴',
    color: 'bg-cyan-500'
  },
  {
    id: 'm2',
    name: 'M2',
    description: 'M2 method for edge solving',
    icon: '🔄',
    color: 'bg-teal-500'
  },
  {
    id: '3-cycles',
    name: '3-Cycles',
    description: '3-Cycle method for advanced blind solving',
    icon: '🔺',
    color: 'bg-pink-500'
  },
  {
    id: '5-cycles',
    name: '5-Cycles',
    description: '5-Cycle method for advanced blind solving',
    icon: '⭐',
    color: 'bg-amber-500'
  }
];

const algorithmSets: AlgorithmSet[] = [
  {
    id: 'pll',
    name: 'PLL',
    description: 'Permutation of Last Layer - 21 algorithms',
    icon: '🔄',
    color: 'bg-purple-500'
  },
  {
    id: 'oll',
    name: 'OLL',
    description: 'Orientation of Last Layer - 57 algorithms',
    icon: '🎯',
    color: 'bg-orange-500'
  },
  {
    id: 'f2l',
    name: 'F2L',
    description: 'First Two Layers - 42 cases',
    icon: '🏗️',
    color: 'bg-green-500'
  },
  {
    id: 'cross',
    name: 'Cross',
    description: 'White Cross - 8 cases',
    icon: '➕',
    color: 'bg-blue-500'
  },
  {
    id: 'zbll',
    name: 'ZBLL',
    description: 'Zborowski-Bruchem Last Layer - 472 algorithms',
    icon: '⚡',
    color: 'bg-red-500'
  },
  {
    id: 'coll',
    name: 'COLL',
    description: 'Corners of Last Layer - 40 algorithms',
    icon: '🔺',
    color: 'bg-yellow-500'
  },
  {
    id: 'ell',
    name: 'ELL',
    description: 'Edges of Last Layer - 29 algorithms',
    icon: '📏',
    color: 'bg-indigo-500'
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Your personal algorithm sets',
    icon: '⭐',
    color: 'bg-gray-500'
  }
];

export const AlgorithmsPanel: React.FC = () => {
  const handleAlgorithmSetClick = (setId: string) => {
    console.log(`Opening algorithm set: ${setId}`);
    // TODO: Navigate to specific algorithm set
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Algorithm Sets</h2>
      
      {/* Blind Methods Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Blind Solving Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blindMethods.map((method) => (
            <div
              key={method.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleAlgorithmSetClick(method.id)}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center text-white text-2xl mr-4`}>
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{method.name}</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  {method.description}
                </p>
                
                <div className="flex justify-end">
                  <ControlButton
                    label="Open"
                    onClick={() => handleAlgorithmSetClick(method.id)}
                    className="px-4 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-300 mb-8"></div>

      {/* Other Algorithm Sets */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Standard Algorithms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {algorithmSets.map((set) => (
            <div
              key={set.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleAlgorithmSetClick(set.id)}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-lg ${set.color} flex items-center justify-center text-white text-2xl mr-4`}>
                    {set.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{set.name}</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  {set.description}
                </p>
                
                <div className="flex justify-end">
                  <ControlButton
                    label="Open"
                    onClick={() => handleAlgorithmSetClick(set.id)}
                    className="px-4 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
