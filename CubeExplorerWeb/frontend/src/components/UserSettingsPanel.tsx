import React, { useState } from 'react';
import ControlButton from './ControlButton';
import { Cube2D } from './Cube2D/Cube2D';

export const UserSettingsPanel: React.FC = () => {
  const [selectedAxis, setSelectedAxis] = useState<'x' | 'y' | 'z'>('x');

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Letter Scheme Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Letter Scheme & Buffer Configuration</h3>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Configure the letter mapping for blind solving memorization and select your preferred buffers.
            </p>

            {/* Axis Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose your starting orientation:
              </label>
              <div className="flex space-x-2">
                <ControlButton
                  label="X"
                  onClick={() => setSelectedAxis('x')}
                  className={`w-12 ${selectedAxis === 'x' ? "bg-blue-500 text-white" : ""}`}
                />
                <ControlButton
                  label="Y"
                  onClick={() => setSelectedAxis('y')}
                  className={`w-12 ${selectedAxis === 'y' ? "bg-blue-500 text-white" : ""}`}
                />
                <ControlButton
                  label="Z"
                  onClick={() => setSelectedAxis('z')}
                  className={`w-12 ${selectedAxis === 'z' ? "bg-blue-500 text-white" : ""}`}
                />
              </div>
            </div>
            
            {/* Cube Visualization */}
            <div className="border border-gray-300 rounded p-4">
              <div className="text-sm font-medium text-gray-700 mb-3">Cube Layout:</div>
              <Cube2D />
            </div>

            <div className="flex space-x-2">
              <ControlButton
                label="Reset to Default"
                onClick={() => console.log('Reset letter scheme')}
              />
              <ControlButton
                label="Save Configuration"
                onClick={() => console.log('Save letter scheme')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
