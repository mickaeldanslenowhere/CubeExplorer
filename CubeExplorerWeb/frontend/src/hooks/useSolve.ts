import { useState, useRef } from 'react';
import { useScrambleContext } from '../contexts/ScrambleContext';

interface SolveResult {
  resolution: string;
  logs?: string[];
  timestamp: string;
}

export const useSolve = () => {
  const [isSolving, setIsSolving] = useState(false);
  const [results, setResults] = useState<SolveResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [realTimeLogs, setRealTimeLogs] = useState<string[]>([]);
  const { scrambleText } = useScrambleContext();
  const abortControllerRef = useRef<AbortController | null>(null);

  const solveCube = async () => {
    setIsSolving(true);
    setError(null);
    setRealTimeLogs([]);

    try {
      if (!scrambleText.trim()) {
        throw new Error('No scramble provided');
      }
      
      // Use Server-Sent Events for real-time logs
      const eventSource = new EventSource(`http://localhost:3001/api/solve?scramble=${encodeURIComponent(scrambleText)}`);
      
      const logs: string[] = [];
      let resolution = '';
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'log') {
            logs.push(data.message);
            setRealTimeLogs([...logs]); // Update real-time logs
            console.log('Real-time log:', data.message);
          } else if (data.type === 'result') {
            resolution = data.data.resolution;
            eventSource.close();
            
            const newResult: SolveResult = {
              resolution,
              logs,
              timestamp: new Date().toISOString(),
            };
            
            setResults(prev => [newResult, ...prev]);
            setIsSolving(false);
            setRealTimeLogs([]); // Clear real-time logs
          } else if (data.type === 'error') {
            eventSource.close();
            setError(data.message);
            setIsSolving(false);
            setRealTimeLogs([]); // Clear real-time logs
          }
        } catch (parseError) {
          console.error('Error parsing SSE data:', parseError);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        eventSource.close();
        setError('Connection error');
        setIsSolving(false);
        setRealTimeLogs([]); // Clear real-time logs
      };
      
      // Store event source for cancellation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      abortControllerRef.current = { close: () => eventSource.close() } as any;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to solve cube');
      console.error('Error solving cube:', err);
      setIsSolving(false);
      setRealTimeLogs([]); // Clear real-time logs
    }
  };

  const cancelSolve = async () => {
    try {
      console.log('Cancelling solve operation...');
      await fetch('http://localhost:3001/api/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Cancel request sent to backend');
    } catch (error) {
      console.error('Error cancelling solve operation:', error);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    solveCube,
    cancelSolve,
    clearResults,
    isSolving,
    results,
    error,
    realTimeLogs,
  };
};
