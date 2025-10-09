import { useState } from 'react';
import { useScramble } from '../hooks/useScramble';

export const ScrambleInput = () => {
  const [scrambleText, setScrambleText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { applyScramble, isValidScramble } = useScramble();

  const handleGenerateScramble = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:3001/api/generate-scramble', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedScramble = data.scramble;
      
      // Set the generated scramble in the input
      setScrambleText(generatedScramble);
      
      // Apply the scramble automatically with reset
      applyScramble(generatedScramble);
      
    } catch (error) {
      console.error('Error generating scramble:', error);
      // Fallback to a simple scramble
      const fallbackScramble = 'R U R';
      setScrambleText(fallbackScramble);
      applyScramble(fallbackScramble);
    } finally {
      setIsGenerating(false);
    }
  };

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
          onClick={handleGenerateScramble}
          disabled={isGenerating}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            isGenerating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
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
          Invalid moves detected. Valid moves: R, U, F, D, L, B, R', U', F', D', L', B', R2, U2, F2, D2, L2, B2, E, S, M, E', S', M', E2, S2, M2, x, y, z, x', y', z', x2, y2, z2
        </div>
      )}
    </div>
  );
};
