import React, { useState } from 'react';
import { useCubeContext } from '../hooks/useContexts';
import { Corners, Edges, getCubieName, type Corner, type Edge } from '@cube-explorer/shared/src/cube/Cubies';

export const BlindCyclesPanel: React.FC = () => {
  const { cubeState } = useCubeContext();
  
  // États pour les buffers sélectionnés
  const [cornerBuffer, setCornerBuffer] = useState<Corner>(Corners[0]); // UBL par défaut
  const [edgeBuffer, setEdgeBuffer] = useState<Edge>(Edges[0]); // UB par défaut

  const blindAnalytics = cubeState.getBlindAnalytics(cornerBuffer, edgeBuffer);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-4">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">🎯 Blind Cycles</h3>
      
      {/* Buffer Selection */}
      <div className="mb-6 p-3 bg-blue-100 rounded border border-blue-300">
        <h4 className="text-sm font-semibold text-blue-800 mb-3">Buffer Selection</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Corner Buffer */}
          <div>
            <label className="block text-xs font-medium text-blue-700 mb-2">
              Corner Buffer:
            </label>
            <select
              value={getCubieName(cornerBuffer)}
              onChange={(e) => {
                const selectedCorner = Corners.find(corner => getCubieName(corner) === e.target.value);
                if (selectedCorner) setCornerBuffer(selectedCorner);
              }}
              className="w-full text-xs px-2 py-1 border border-blue-300 rounded bg-white"
            >
              {Corners.map((corner, index) => (
                <option key={index} value={getCubieName(corner)}>
                  {getCubieName(corner)}
                </option>
              ))}
            </select>
          </div>

          {/* Edge Buffer */}
          <div>
            <label className="block text-xs font-medium text-blue-700 mb-2">
              Edge Buffer:
            </label>
            <select
              value={getCubieName(edgeBuffer)}
              onChange={(e) => {
                const selectedEdge = Edges.find(edge => getCubieName(edge) === e.target.value);
                if (selectedEdge) setEdgeBuffer(selectedEdge);
              }}
              className="w-full text-xs px-2 py-1 border border-blue-300 rounded bg-white"
            >
              {Edges.map((edge, index) => (
                <option key={index} value={getCubieName(edge)}>
                  {getCubieName(edge)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
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
