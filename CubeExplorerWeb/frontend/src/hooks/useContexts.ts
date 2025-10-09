import { useContext } from 'react';
import { CubeContext } from '../contexts/CubeContextDefinition';
import { ColorContext } from '../contexts/ColorContextDefinition';

export const useCubeContext = () => {
  const context = useContext(CubeContext);
  if (context === undefined) {
    throw new Error('useCubeContext must be used within a CubeProvider');
  }
  return context;
};

export const useColorContext = () => {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColorContext must be used within a ColorProvider');
  }
  return context;
};
