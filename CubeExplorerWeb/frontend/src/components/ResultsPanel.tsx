import React from 'react';
import { useCubeContext } from '../hooks/useContexts';

interface SolveResult {
  resolution: string;
  logs?: string[];
  timestamp: string;
}

interface ResultsPanelProps {
  results: SolveResult[];
  isSolving: boolean;
  error: string | null;
  onClearResults: () => void;
  realTimeLogs?: string[];
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  results,
  isSolving,
  error,
  onClearResults,
  realTimeLogs = [],
}) => {
  const { cubeState } = useCubeContext();

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const copyCubeStateToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cubeState.toString());
      // You could add a toast notification here if you have one
    } catch (err) {
      console.error('Failed to copy cube state:', err);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 border border-gray-300 rounded p-4">
      {/* Current Cube State Display */}
      <div className="mb-4 bg-white border border-gray-200 rounded p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-semibold text-gray-700">Current Cube State</div>
          <button
            onClick={copyCubeStateToClipboard}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
            title="Copy cube state to clipboard"
          >
            Copy
          </button>
        </div>
        <div className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded border">
          {cubeState.toString()}
        </div>
      </div>

      {isSolving && (
        <div className="py-4">
          <div className="text-sm text-blue-600 mb-2">Solving cube...</div>
          {realTimeLogs.length > 0 && (
            <div className="bg-gray-100 border border-gray-200 rounded p-3 max-h-32 overflow-y-auto">
              <div className="text-xs text-gray-600 font-semibold mb-1">Real-time logs:</div>
              <div className="space-y-1">
                {realTimeLogs.map((log, index) => (
                  <div key={index} className="text-xs text-gray-500 font-mono">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <div className="text-sm text-red-600 mb-2">Error: {error}</div>
          <button
            onClick={onClearResults}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear
          </button>
        </div>
      )}

      {!isSolving && !error && results.length === 0 && (
        <div className="text-sm text-gray-600 text-center py-8">
          No solutions yet
        </div>
      )}

      {!isSolving && !error && results.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">
              Solutions ({results.length})
            </h3>
            <button
              onClick={onClearResults}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded p-3">
                <div className="text-sm font-mono text-gray-800 mb-1">
                  {result.resolution}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {formatTimestamp(result.timestamp)}
                </div>
                {result.logs && result.logs.length > 0 && (
                  <div className="mt-2 border-t border-gray-100 pt-2">
                    <div className="text-xs text-gray-600 font-semibold mb-1">Logs:</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {result.logs.map((log, logIndex) => (
                        <div key={logIndex} className="text-xs text-gray-500 font-mono">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
