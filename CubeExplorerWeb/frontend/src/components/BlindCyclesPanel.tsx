import React from 'react';
import { useCubeContext } from '../hooks/useContexts';

interface CycleInfo {
  cubies: string[];
  orientations: { [cubieName: string]: number };
}

interface BlindCyclesPanelProps {
  cornerCycles: CycleInfo[];
  edgeCycles: CycleInfo[];
}

export const BlindCyclesPanel: React.FC<BlindCyclesPanelProps> = ({
  cornerCycles,
  edgeCycles,
}) => {
  const formatCycle = (cycle: CycleInfo) => {
    if (cycle.cubies.length <= 1) return null;
    return cycle.cubies.join(' → ');
  };

  const formatSingleCubieOrientations = (cycle: CycleInfo) => {
    if (cycle.cubies.length !== 1) return null;
    const cubieName = cycle.cubies[0];
    const orientation = cycle.orientations[cubieName];
    return `${cubieName}: ${orientation}`;
  };

  const multiCycles = cornerCycles.filter(cycle => cycle.cubies.length > 1);
  const singleCornerCycles = cornerCycles.filter(cycle => cycle.cubies.length === 1);
  const multiEdgeCycles = edgeCycles.filter(cycle => cycle.cubies.length > 1);
  const singleEdgeCycles = edgeCycles.filter(cycle => cycle.cubies.length === 1);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-4">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">🎯 Blind Cycles</h3>
      
      {/* Coins */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-blue-700 mb-2">Coins :</div>
        
        {multiCycles.length > 0 && (
          <div className="text-sm text-blue-600 mb-2">
            Cycles: {multiCycles.map((cycle, index) => (
              <span key={index}>
                {formatCycle(cycle)}
                {index < multiCycles.length - 1 ? ' / ' : ''}
              </span>
            ))}
          </div>
        )}
        
        {singleCornerCycles.length > 0 && (
          <div className="text-sm text-blue-600">
            Orientation: {singleCornerCycles.map((cycle, index) => (
              <span key={index}>
                {formatSingleCubieOrientations(cycle)}
                {index < singleCornerCycles.length - 1 ? ' / ' : ''}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Arêtes */}
      <div>
        <div className="text-sm font-semibold text-blue-700 mb-2">Arêtes :</div>
        
        {multiEdgeCycles.length > 0 && (
          <div className="text-sm text-blue-600 mb-2">
            Cycles: {multiEdgeCycles.map((cycle, index) => (
              <span key={index}>
                {formatCycle(cycle)}
                {index < multiEdgeCycles.length - 1 ? ' / ' : ''}
              </span>
            ))}
          </div>
        )}
        
        {singleEdgeCycles.length > 0 && (
          <div className="text-sm text-blue-600">
            Orientation: {singleEdgeCycles.map((cycle, index) => (
              <span key={index}>
                {formatSingleCubieOrientations(cycle)}
                {index < singleEdgeCycles.length - 1 ? ' / ' : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
