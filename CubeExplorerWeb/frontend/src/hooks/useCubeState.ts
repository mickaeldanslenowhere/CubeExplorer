import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { CubeState, Move } from '../types';

interface UseCubeStateReturn {
  cubeState: CubeState;
  isSolving: boolean;
  isScrambling: boolean;
  solveTime: number;
  moveCount: number;
  bestTime: number | undefined;
  totalSolves: number;
  averageTime: number;
  scrambleCube: () => void;
  solveCube: () => void;
  resetCube: () => void;
  applyMove: (move: string) => void;
  startTimer: () => void;
  stopTimer: () => void;
}

const generateSolvedCube = (): CubeState => ({
  id: 'solved',
  faces: {
    front: Array(9).fill('#ff0000'),
    back: Array(9).fill('#ff8800'),
    left: Array(9).fill('#00ff00'),
    right: Array(9).fill('#0000ff'),
    up: Array(9).fill('#ffffff'),
    down: Array(9).fill('#ffff00')
  },
  timestamp: Date.now()
});

const generateScrambledCube = (): CubeState => {
  const cube = generateSolvedCube();
  const scrambleMoves = ['R', 'U', 'R\'', 'U\'', 'L', 'D', 'L\'', 'D\'', 'F', 'B', 'F\'', 'B\''];
  
  // Apply random scramble
  for (let i = 0; i < 20; i++) {
    const randomMove = scrambleMoves[Math.floor(Math.random() * scrambleMoves.length)];
    // TODO: Implement actual move application
  }
  
  return cube;
};

export const useCubeState = (): UseCubeStateReturn => {
  const { emit, on, off, isConnected } = useSocket();
  const [cubeState, setCubeState] = useState<CubeState>(generateSolvedCube());
  const [isSolving, setIsSolving] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [solveTime, setSolveTime] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [bestTime, setBestTime] = useState<number | undefined>(undefined);
  const [totalSolves, setTotalSolves] = useState(0);
  const [averageTime, setAverageTime] = useState(0);
  const [timerStart, setTimerStart] = useState<number | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerStart) {
      interval = setInterval(() => {
        setSolveTime(Math.floor((Date.now() - timerStart) / 1000));
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerStart]);

  // Socket event listeners
  useEffect(() => {
    if (!isConnected) return;

    // Handle solve response
    const handleSolveResponse = (data: any) => {
      console.log('Solve response:', data);
      setIsSolving(false);
      stopTimer();
      setCubeState(generateSolvedCube());
    };

    // Handle solve error
    const handleSolveError = (data: any) => {
      console.error('Solve error:', data);
      setIsSolving(false);
    };

    // Handle scramble response
    const handleScrambleResponse = (data: any) => {
      console.log('Scramble response:', data);
      setIsScrambling(false);
      // TODO: Apply scramble moves to cube
    };

    // Handle scramble error
    const handleScrambleError = (data: any) => {
      console.error('Scramble error:', data);
      setIsScrambling(false);
    };

    // Register event listeners
    on('solve-response', handleSolveResponse);
    on('solve-error', handleSolveError);
    on('scramble-response', handleScrambleResponse);
    on('scramble-error', handleScrambleError);

    // Cleanup
    return () => {
      off('solve-response', handleSolveResponse);
      off('solve-error', handleSolveError);
      off('scramble-response', handleScrambleResponse);
      off('scramble-error', handleScrambleError);
    };
  }, [isConnected, on, off, stopTimer]);

  const startTimer = useCallback(() => {
    setTimerStart(Date.now());
    setSolveTime(0);
  }, []);

  const stopTimer = useCallback(() => {
    setTimerStart(null);
    const finalTime = solveTime;
    
    if (!bestTime || finalTime < bestTime) {
      setBestTime(finalTime);
    }
    
    setTotalSolves(prev => prev + 1);
    setAverageTime(prev => (prev * (totalSolves - 1) + finalTime) / totalSolves);
  }, [solveTime, bestTime, totalSolves]);

  const scrambleCube = useCallback(async () => {
    setIsScrambling(true);
    setMoveCount(0);
    
    if (isConnected) {
      emit('scramble-request');
    } else {
      // Fallback to local scrambling
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCubeState(generateScrambledCube());
    }
    
    setIsScrambling(false);
    startTimer();
  }, [startTimer, emit, isConnected]);

  const solveCube = useCallback(async () => {
    setIsSolving(true);
    
    if (isConnected) {
      emit('solve-request', { cubeState, algorithm: 'CFOP' });
    } else {
      // Fallback to local solving
      const solveMoves = ['R', 'U', 'R\'', 'U\'', 'L', 'D', 'L\'', 'D\''];
      
      for (let i = 0; i < solveMoves.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setMoveCount(i + 1);
        // TODO: Apply actual move
      }
      
      setIsSolving(false);
      stopTimer();
      setCubeState(generateSolvedCube());
    }
  }, [stopTimer, emit, isConnected, cubeState]);

  const resetCube = useCallback(() => {
    setCubeState(generateSolvedCube());
    setMoveCount(0);
    setSolveTime(0);
    setTimerStart(null);
  }, []);

  const applyMove = useCallback((move: string) => {
    setMoveCount(prev => prev + 1);
    
    if (isConnected) {
      emit('validate-move', { move, cubeState });
    }
    
    // TODO: Implement actual move application
    console.log(`Applying move: ${move}`);
  }, [emit, isConnected, cubeState]);

  return {
    cubeState,
    isSolving,
    isScrambling,
    solveTime,
    moveCount,
    bestTime,
    totalSolves,
    averageTime,
    scrambleCube,
    solveCube,
    resetCube,
    applyMove,
    startTimer,
    stopTimer
  };
};
