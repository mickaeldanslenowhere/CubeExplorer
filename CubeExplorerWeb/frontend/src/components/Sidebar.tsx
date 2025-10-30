import React from 'react';

export type SidebarTab = 'cube' | 'settings' | 'algs' | 'timer' | 'roadmap';

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">CubeExplorer</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onTabChange('cube')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                activeTab === 'cube'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              🎯 Cube Management
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabChange('settings')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              ⚙️ User Settings
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabChange('algs')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                activeTab === 'algs'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              🧩 Algorithms
            </button>
          </li>
          <li>
            <button
              onClick={() => onTabChange('timer')}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                activeTab === 'timer'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              ⏱️ Timer
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 mb-2">
          Version 1.0.0
        </div>
        <button
          onClick={() => onTabChange('roadmap')}
          className={`w-full text-left px-3 py-2 rounded transition-colors text-xs ${
            activeTab === 'roadmap'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          📋 Roadmap
        </button>
      </div>
    </div>
  );
};
