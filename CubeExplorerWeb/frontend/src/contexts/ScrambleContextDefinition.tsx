import { createContext } from 'react';

export interface ScrambleContextType {
  scrambleText: string;
  setScrambleText: (text: string) => void;
  appendToScramble: (move: string) => void;
  clearScramble: () => void;
  isInputInvalid: boolean;
  setInputInvalid: (invalid: boolean) => void;
}

export const ScrambleContext = createContext<ScrambleContextType | undefined>(undefined);
