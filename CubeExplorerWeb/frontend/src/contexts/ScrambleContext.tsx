import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScrambleContextType {
  scrambleText: string;
  setScrambleText: (text: string) => void;
  appendToScramble: (move: string) => void;
  clearScramble: () => void;
}

const ScrambleContext = createContext<ScrambleContextType | undefined>(undefined);

interface ScrambleProviderProps {
  children: ReactNode;
}

export const ScrambleProvider: React.FC<ScrambleProviderProps> = ({ children }) => {
  const [scrambleText, setScrambleText] = useState('');

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
  };

  return (
    <ScrambleContext.Provider value={{
      scrambleText,
      setScrambleText,
      appendToScramble,
      clearScramble
    }}>
      {children}
    </ScrambleContext.Provider>
  );
};

export const useScrambleContext = () => {
  const context = useContext(ScrambleContext);
  if (context === undefined) {
    throw new Error('useScrambleContext must be used within a ScrambleProvider');
  }
  return context;
};
