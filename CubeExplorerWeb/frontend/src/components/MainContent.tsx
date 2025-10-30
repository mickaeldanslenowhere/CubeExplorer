import React, { useState } from 'react';
import { Sidebar, type SidebarTab } from './Sidebar';
import { UserSettingsPanel } from './UserSettingsPanel';
import { AlgorithmsPanel } from './AlgorithmsPanel';
import { TimerPanel } from './TimerPanel';
import { RoadmapPanel } from './RoadmapPanel';

interface MainContentProps {
  children: React.ReactNode; // Le contenu principal (cube management)
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('cube');

  const renderContent = () => {
    switch (activeTab) {
      case 'cube':
        return children;
      case 'settings':
        return <UserSettingsPanel />;
      case 'algs':
        return <AlgorithmsPanel />;
      case 'timer':
        return <TimerPanel />;
      case 'roadmap':
        return <RoadmapPanel />;
      default:
        return children;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};
