import React from 'react';

interface SolveResult {
  resolution: string;
  timestamp: string;
}

interface ResultsPanelProps {
  results: SolveResult[];
  isSolving: boolean;
  error: string | null;
  onClearResults: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  results,
  isSolving,
  error,
  onClearResults,
}) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="flex-1 bg-gray-50 border border-gray-300 rounded p-4">
      {isSolving && (
        <div className="text-center py-4">
          <div className="text-sm text-blue-600">Solving cube...</div>
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
                <div className="text-xs text-gray-500">
                  {formatTimestamp(result.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
