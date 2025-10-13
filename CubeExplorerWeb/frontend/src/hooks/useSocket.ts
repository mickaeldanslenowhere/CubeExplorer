/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback: (data: any) => void) => void;
}

export const useSocket = (): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const isConnectedRef = useRef<boolean>(false);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      timeout: 20000,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to server');
      isConnectedRef.current = true;
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      isConnectedRef.current = false;
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      isConnectedRef.current = false;
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const emit = (event: string, data?: any) => {
    if (socketRef.current && isConnectedRef.current) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  };

  const on = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    socket: socketRef.current,
    isConnected: isConnectedRef.current,
    emit,
    on,
    off
  };
};
