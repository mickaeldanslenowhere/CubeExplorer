import { useState } from 'react';
import { useScrambleContext } from '../hooks/useScrambleContext';
import { applyScramble, isValidScramble } from '@cube-explorer/shared';
import { useCubeContext } from '../hooks/useContexts';

export const ScrambleInput = () => {
  const { scrambleText, setScrambleText, clearScramble, isInputInvalid, setInputInvalid } = useScrambleContext();
  const [isGenerating, setIsGenerating] = useState(false);

  const { cubeState, setCubeState } = useCubeContext();


  const handleApplyScramble = (scramble: string) => {
    applyScramble(cubeState, scramble);
    setCubeState(cubeState);
    setInputInvalid(false); // Reset invalid state when applying a scramble
  };

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
      handleApplyScramble(generatedScramble);
      
    } catch (error) {
      console.error('Error generating scramble:', error);
      // Fallback to a simple scramble
      const fallbackScramble = 'R U R';
      setScrambleText(fallbackScramble);
      handleApplyScramble(fallbackScramble);
    } finally {
      setIsGenerating(false);
    }
  };

  const isScrambleValid = isValidScramble(scrambleText) && !isInputInvalid;

  return (
    <div className="border border-gray-400 rounded p-3 mb-4">
      <div className="text-xs font-semibold text-gray-700 mb-2">Scramble</div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={scrambleText}
          onChange={(e) => setScrambleText(e.target.value)}
          placeholder={isInputInvalid ? "Cube modified manually - click 'Clean' to reset" : "Enter moves (e.g., R U F' D L' B)"}
          disabled={isInputInvalid}
          className={`flex-1 px-2 py-1 text-xs border rounded ${
            isInputInvalid
              ? 'border-orange-500 bg-orange-50 text-gray-500 cursor-not-allowed'
              : scrambleText && !isScrambleValid 
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
          onClick={() => handleApplyScramble(scrambleText)}
          disabled={!isScrambleValid || isInputInvalid}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            isScrambleValid && !isInputInvalid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Apply
        </button>
        <button
          onClick={clearScramble}
          disabled={!scrambleText}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            scrambleText
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Clear
        </button>
      </div>
      {isInputInvalid && (
        <div className="text-xs text-orange-600 mt-1">
          ⚠️ Cube has been modified manually. Click "Clean" to reset and enable scramble input.
        </div>
      )}
      {scrambleText && !isScrambleValid && !isInputInvalid && (
        <div className="text-xs text-red-600 mt-1">
          Invalid moves detected. Valid moves: R, U, F, D, L, B, R', U', F', D', L', B', R2, U2, F2, D2, L2, B2, E, S, M, E', S', M', E2, S2, M2, x, y, z, x', y', z', x2, y2, z2
        </div>
      )}
    </div>
  );
};
