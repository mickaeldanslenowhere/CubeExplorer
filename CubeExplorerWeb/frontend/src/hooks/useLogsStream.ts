import { useState, useEffect, useRef } from 'react';

interface LogMessage {
  type: 'log' | 'connected' | 'error';
  message: string;
}

export const useLogsStream = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Connect to logs stream on mount
    const connectToLogs = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = new EventSource('http://localhost:3001/api/logs-stream');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data: LogMessage = JSON.parse(event.data);
          
          if (data.type === 'connected') {
            setIsConnected(true);
          } else if (data.type === 'log') {
            setLogs(prev => [...prev, data.message]);
          }
        } catch (error) {
            setLogs(prev => [...prev, 'Error parsing log message: ' + error]);
        }
      };

      eventSource.onerror = (error) => {
        setLogs(prev => [...prev, 'Logs stream error: ' + error]);
        setIsConnected(false);
        
        // Try to reconnect after 3 seconds
        setTimeout(() => {
          if (!eventSourceRef.current || eventSourceRef.current.readyState === EventSource.CLOSED) {
            connectToLogs();
          }
        }, 3000);
      };
    };

    connectToLogs();

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  return {
    isConnected,
    logs,
    clearLogs
  };
};
