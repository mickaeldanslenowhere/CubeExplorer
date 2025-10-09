import React, { useState } from 'react';
import { Colors, type Color } from '../hooks/useColors';
import { ColorContext } from './ColorContextDefinition';

export const ColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedColor, setSelectedColor] = useState<Color>(Colors.WHITE);

  return (
    <ColorContext.Provider value={{ selectedColor, setSelectedColor }}>
      {children}
    </ColorContext.Provider>
  );
};
