import React, { useState, useEffect } from 'react';
import { CubeContext } from './CubeContextDefinition';
import CubeState from '@cube-explorer/shared/src/cube/CubeState';

export const CubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [cubeState, setCubeState] = useState<CubeState>(new CubeState());

  // Log cubeState changes
  useEffect(() => {
    console.log('cubeState', cubeState);
  }, [cubeState]);

  return (
    <CubeContext.Provider value={{ cubeState, setCubeState, defaultCubeState: new CubeState() }}>
      {children}
    </CubeContext.Provider>
  );
};
