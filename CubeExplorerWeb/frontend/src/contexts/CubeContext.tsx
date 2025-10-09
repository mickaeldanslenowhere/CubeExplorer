import React, { useState, useEffect } from 'react';
import { useColorScheme } from '../hooks/useColorScheme';
import { CubeContext } from './CubeContextDefinition';
import type { Color } from '../hooks/useColors';

export const CubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getColorScheme } = useColorScheme();

  const defaultCubeState = {
    up: Array(9).fill(getColorScheme().UColor),
    front: Array(9).fill(getColorScheme().FColor),
    left: Array(9).fill(getColorScheme().LColor),
    right: Array(9).fill(getColorScheme().RColor),
    back: Array(9).fill(getColorScheme().BColor),
    down: Array(9).fill(getColorScheme().DColor)
  };

  const [cubeState, setCubeState] = useState<Record<string, Color[]>>(defaultCubeState);

  // Log cubeState changes
  useEffect(() => {
    console.log('cubeState', cubeState);
  }, [cubeState]);

  return (
    <CubeContext.Provider value={{ cubeState, setCubeState, defaultCubeState }}>
      {children}
    </CubeContext.Provider>
  );
};
