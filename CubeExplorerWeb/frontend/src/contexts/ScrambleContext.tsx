import React, { useState, type ReactNode } from 'react';
import { ScrambleContext } from './ScrambleContextDefinition';

interface ScrambleProviderProps {
  children: ReactNode;
}

export const ScrambleProvider: React.FC<ScrambleProviderProps> = ({ children }) => {
  const [scrambleText, setScrambleText] = useState('');
  const [isInputInvalid, setIsInputInvalid] = useState(false);

  const appendToScramble = (move: string) => {
    setScrambleText(prev => {
      if (prev === '') {
        return move;
      }
      return `${prev} ${move}`;
    });
  };

  const clearScramble = () => {
    setScrambleText('');
    setIsInputInvalid(false);
  };

  return (
    <ScrambleContext.Provider value={{
      scrambleText,
      setScrambleText,
      appendToScramble,
      clearScramble,
      isInputInvalid,
      setInputInvalid: setIsInputInvalid
    }}>
      {children}
    </ScrambleContext.Provider>
  );
};

