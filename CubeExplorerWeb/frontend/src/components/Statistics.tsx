import React from 'react';

interface StatisticsProps {
  solveTime: number;
  moveCount: number;
  bestTime?: number;
  totalSolves: number;
  averageTime: number;
}

const Statistics: React.FC<StatisticsProps> = ({
  solveTime,
  moveCount,
  bestTime,
  totalSolves,
  averageTime
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(2);
    return minutes > 0 ? `${minutes}:${seconds.padStart(5, '0')}` : `${seconds}s`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Current Solve */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">Current Solve</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-bold text-blue-600">{formatTime(solveTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Moves:</span>
              <span className="font-bold text-blue-600">{moveCount}</span>
            </div>
          </div>
        </div>

        {/* Best Time */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-800 mb-2">Best Time</h4>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {bestTime ? formatTime(bestTime) : '--'}
            </div>
            <div className="text-sm text-gray-600">Personal Best</div>
          </div>
        </div>

        {/* Total Solves */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-purple-800 mb-2">Total Solves</h4>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{totalSolves}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Average Time */}
        <div className="bg-orange-50 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-orange-800 mb-2">Average Time</h4>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{formatTime(averageTime)}</div>
            <div className="text-sm text-gray-600">Mean Time</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Solve Progress</h4>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((moveCount / 20) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>0 moves</span>
          <span>20+ moves</span>
        </div>
      </div>

      {/* Recent Times */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">Recent Times</h4>
        <div className="space-y-2">
          {[12.34, 15.67, 18.92, 14.23, 16.45].map((time, index) => (
            <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-gray-600">Solve #{totalSolves - index}</span>
              <span className="font-medium">{formatTime(time)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
