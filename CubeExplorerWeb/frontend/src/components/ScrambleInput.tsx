import { useState } from 'react';
import { useScramble } from '../hooks/useScramble';

export const ScrambleInput = () => {
  const [scrambleText, setScrambleText] = useState('');
  const { applyScramble, isValidScramble } = useScramble();

  const isScrambleValid = isValidScramble(scrambleText);

  return (
    <div className="border border-gray-400 rounded p-3 mb-4">
      <div className="text-xs font-semibold text-gray-700 mb-2">Scramble</div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={scrambleText}
          onChange={(e) => setScrambleText(e.target.value)}
          placeholder="Enter moves (e.g., R U F' D L' B)"
          className={`flex-1 px-2 py-1 text-xs border rounded ${
            scrambleText && !isScrambleValid 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-400'
          }`}
        />
        <button
          onClick={() => applyScramble(scrambleText)}
          disabled={!isScrambleValid}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            isScrambleValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Apply
        </button>
      </div>
      {scrambleText && !isScrambleValid && (
        <div className="text-xs text-red-600 mt-1">
          Invalid moves detected. Valid moves: R, U, F, D, L, B, R', U', F', D', L', B', E, S, M, E', S', M', x, y, z, x', y', z'
        </div>
      )}
    </div>
  );
};
