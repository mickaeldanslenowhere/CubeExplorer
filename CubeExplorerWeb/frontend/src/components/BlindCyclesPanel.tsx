import React from 'react';
import { useCubeContext } from '../hooks/useContexts';

export const BlindCyclesPanel: React.FC = () => {
  const { cubeState } = useCubeContext();

  const blindAnalytics = cubeState.getBlindAnalytics();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-4">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">🎯 Blind Cycles</h3>
      
      {/* Coins */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-blue-700 mb-2">Coins :</div>
        
        {blindAnalytics.corners.cornersResult.cycles.length > 0 && (
          <div className="text-sm text-blue-600 mb-2">
            Cycles: {blindAnalytics.corners.cornersResult.cycles.map((cycle, index) => (
              <span key={index}>
                {cycle}
                {index < blindAnalytics.corners.cycles.length - 1 ? ' / ' : ''}
              </span>
            ))}
          </div>
        )}
        
        {blindAnalytics.corners.cornersResult.orientations.length > 0 && (
          <div className="text-sm text-blue-600">
            Orientation: {blindAnalytics.corners.cornersResult.orientations.map((orientation, index) => (
              <span key={index}>
                {orientation}
                {index < blindAnalytics.corners.cornersResult.orientations.length - 1 ? ' / ' : ''}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Arêtes */}
      <div>
        <div className="text-sm font-semibold text-blue-700 mb-2">Arêtes :</div>
        
        {blindAnalytics.edges.edgesResult.cycles.length > 0 && (
          <div className="text-sm text-blue-600 mb-2">
            Cycles: {blindAnalytics.edges.edgesResult.cycles.map((cycle, index) => (
              <span key={index}>
                {cycle}
                {index < blindAnalytics.edges.edgesResult.cycles.length - 1 ? ' / ' : ''}
              </span>
            ))}
          </div>
        )}
        
        {blindAnalytics.edges.edgesResult.orientations.length > 0 && (
          <div className="text-sm text-blue-600">
            Orientation: {blindAnalytics.edges.edgesResult.orientations.map((orientation, index) => (
              <span key={index}>
                {orientation}
                {index < blindAnalytics.edges.edgesResult.orientations.length - 1 ? ' / ' : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
