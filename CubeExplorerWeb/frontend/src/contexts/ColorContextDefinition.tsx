import { createContext } from 'react';
import type { Color } from '../hooks/useColors';

export interface ColorContextType {
  selectedColor: Color;
  setSelectedColor: (color: Color) => void;
}

export const ColorContext = createContext<ColorContextType | undefined>(undefined);
