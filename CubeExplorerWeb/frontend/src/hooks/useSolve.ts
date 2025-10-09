import { useState } from 'react';
import { useCubeContext } from './useContexts';

interface SolveResult {
  resolution: string;
  timestamp: string;
}

export const useSolve = () => {
  const [isSolving, setIsSolving] = useState(false);
  const [results, setResults] = useState<SolveResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { cubeState } = useCubeContext();

  const solveCube = async () => {
    setIsSolving(true);
    setError(null);

    try {
      
      const response = await fetch('http://localhost:3001/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cubeState }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const newResult: SolveResult = {
        resolution: data.resolution,
        timestamp: new Date().toISOString(),
      };

      setResults(prev => [newResult, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to solve cube');
      console.error('Error solving cube:', err);
    } finally {
      setIsSolving(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    solveCube,
    clearResults,
    isSolving,
    results,
    error,
  };
};
