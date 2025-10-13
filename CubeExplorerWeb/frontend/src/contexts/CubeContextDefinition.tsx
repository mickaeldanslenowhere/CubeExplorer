import { createContext } from 'react';
import type CubeState from '@cube-explorer/shared/src/cube/CubeState';

export interface CubeContextType {
  cubeState: CubeState;
  setCubeState: (state: CubeState) => void;
  defaultCubeState: CubeState;
}

export const CubeContext = createContext<CubeContextType | undefined>(undefined);
