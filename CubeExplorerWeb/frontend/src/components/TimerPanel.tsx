import React, { useState, useEffect, useRef } from 'react';
import ControlButton from './ControlButton';

interface SolveTime {
  id: string;
  time: number;
  scramble: string;
  timestamp: Date;
  penalty?: 'DNF' | '+2';
}

export const TimerPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [solves, setSolves] = useState<SolveTime[]>([]);
  const [currentScramble, setCurrentScramble] = useState('');
  const [isReady, setIsReady] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Mock scramble generator
  const generateScramble = () => {
    const moves = ['R', 'L', 'U', 'D', 'F', 'B'];
    const modifiers = ['', "'", '2'];
    const scramble = Array.from({ length: 20 }, () => {
      const move = moves[Math.floor(Math.random() * moves.length)];
      const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
      return move + modifier;
    }).join(' ');
    return scramble;
  };

  // Format time display
  const formatTime = (milliseconds: number) => {
    const totalSeconds = milliseconds / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(2);
    
    if (minutes > 0) {
      return `${minutes}:${seconds.padStart(5, '0')}`;
    }
    return seconds;
  };

  // Start timer
  const startTimer = () => {
    if (!isReady) return;
    
    setIsRunning(true);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startTimeRef.current);
    }, 10);
  };

  // Stop timer
  const stopTimer = () => {
    if (!isRunning) return;
    
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Add solve to history
    const newSolve: SolveTime = {
      id: Date.now().toString(),
      time: time,
      scramble: currentScramble,
      timestamp: new Date()
    };
    
    setSolves(prev => [newSolve, ...prev]);
    setTime(0);
    setIsReady(false);
    setCurrentScramble(generateScramble());
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setIsReady(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Space bar handling
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isRunning && !isReady) {
          setIsReady(true);
        } else if (isReady && !isRunning) {
          startTimer();
        } else if (isRunning) {
          stopTimer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRunning, isReady]);

  // Initialize scramble
  useEffect(() => {
    setCurrentScramble(generateScramble());
  }, []);

  // Calculate statistics
  const getStatistics = () => {
    if (solves.length === 0) return null;
    
    const times = solves.map(s => s.time);
    const best = Math.min(...times);
    const worst = Math.max(...times);
    const average = times.reduce((a, b) => a + b, 0) / times.length;
    
    // Calculate Ao5 (average of 5)
    const ao5 = solves.length >= 5 
      ? times.slice(0, 5).reduce((a, b) => a + b, 0) / 5 
      : null;
    
    return { best, worst, average, ao5 };
  };

  const stats = getStatistics();

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Timer</h2>
      
      {/* Main Timer Display */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="text-center">
          {/* Timer Display */}
          <div className="text-6xl font-mono font-bold text-gray-800 mb-4">
            {formatTime(time)}
          </div>
          
          {/* Status */}
          <div className="text-lg mb-6">
            {!isReady && !isRunning && (
              <span className="text-gray-500">Press SPACE to ready</span>
            )}
            {isReady && !isRunning && (
              <span className="text-yellow-600">Ready - Press SPACE to start</span>
            )}
            {isRunning && (
              <span className="text-red-600">Running - Press SPACE to stop</span>
            )}
          </div>
          
          {/* Control Buttons */}
          <div className="flex justify-center space-x-4">
            <ControlButton
              label="Reset"
              onClick={resetTimer}
              className="px-6 py-2 bg-gray-600 text-white hover:bg-gray-700"
            />
            <ControlButton
              label={isRunning ? "Stop" : isReady ? "Start" : "Ready"}
              onClick={isRunning ? stopTimer : isReady ? startTimer : () => setIsReady(true)}
              className={`px-6 py-2 ${
                isRunning 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : isReady 
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            />
          </div>
        </div>
      </div>

      {/* Current Scramble */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Scramble</h3>
        <div className="font-mono text-sm text-gray-600 bg-gray-100 p-3 rounded">
          {currentScramble}
        </div>
        <div className="mt-2">
          <ControlButton
            label="New Scramble"
            onClick={() => setCurrentScramble(generateScramble())}
            className="px-4 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700"
          />
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatTime(stats.best)}</div>
              <div className="text-sm text-gray-600">Best</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{formatTime(stats.worst)}</div>
              <div className="text-sm text-gray-600">Worst</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatTime(stats.average)}</div>
              <div className="text-sm text-gray-600">Average</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.ao5 ? formatTime(stats.ao5) : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Ao5</div>
            </div>
          </div>
        </div>
      )}

      {/* Solve History */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Solves</h3>
          {solves.length > 0 && (
            <ControlButton
              label="Clear All"
              onClick={() => setSolves([])}
              className="px-4 py-1 text-sm bg-red-600 text-white hover:bg-red-700"
            />
          )}
        </div>
        
        {solves.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No solves yet. Start timing!
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {solves.map((solve, index) => (
              <div key={solve.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-600">#{solves.length - index}</span>
                  <span className="font-mono text-lg font-semibold text-gray-800">
                    {formatTime(solve.time)}
                  </span>
                  {solve.penalty && (
                    <span className={`text-sm font-medium ${
                      solve.penalty === 'DNF' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {solve.penalty}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {solve.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
