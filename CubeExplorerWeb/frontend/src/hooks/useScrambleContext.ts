import { useContext } from 'react';
import { ScrambleContext } from '../contexts/ScrambleContextDefinition';

export const useScrambleContext = () => {
  const context = useContext(ScrambleContext);
  if (context === undefined) {
    throw new Error('useScrambleContext must be used within a ScrambleProvider');
  }
  return context;
};
