import React, { useState } from 'react';
import { CubeFacets, type CubeFacet } from '@cube-explorer/shared/src/cube/CubeFacet';
import { ColorContext } from './ColorContextDefinition';

export const ColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedColor, setSelectedColor] = useState<CubeFacet>(CubeFacets.WHITE);

  return (
    <ColorContext.Provider value={{ selectedColor, setSelectedColor }}>
      {children}
    </ColorContext.Provider>
  );
};
