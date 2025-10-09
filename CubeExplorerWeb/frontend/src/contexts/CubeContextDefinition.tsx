import { createContext } from 'react';
import type { Color } from '../hooks/useColors';

export interface CubeContextType {
  cubeState: Record<string, Color[]>;
  setCubeState: (state: Record<string, Color[]>) => void;
  defaultCubeState: Record<string, Color[]>;
}

export const CubeContext = createContext<CubeContextType | undefined>(undefined);
