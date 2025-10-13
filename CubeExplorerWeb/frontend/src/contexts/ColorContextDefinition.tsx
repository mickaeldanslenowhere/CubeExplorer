import { createContext } from 'react';
import type { CubeFacet } from '@cube-explorer/shared/src/cube/CubeFacet';

export interface ColorContextType {
  selectedColor: CubeFacet;
  setSelectedColor: (color: CubeFacet) => void;
}

export const ColorContext = createContext<ColorContextType | undefined>(undefined);
