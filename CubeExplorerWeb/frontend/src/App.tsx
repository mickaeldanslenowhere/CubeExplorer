import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { colors } from './hooks/useColors';
import ControlButton from './components/ControlButton';
import useViewMode from './hooks/useViewMode';
import { BackendStatus } from './components/BackendStatus';
import { MoveCubeButtons } from './components/MoveCubeButtons';
import { CubeProvider } from './contexts/CubeContext';
import { ColorProvider } from './contexts/ColorContext';
import { ScrambleProvider } from './contexts/ScrambleContext';
import { useScrambleContext } from './hooks/useScrambleContext';
import { useCubeContext, useColorContext } from './hooks/useContexts';
import { Cube2D } from './components/Cube2D/Cube2D';
import { ScrambleInput } from './components/ScrambleInput';
import { useSolve } from './hooks/useSolve';
import { ResultsPanel } from './components/ResultsPanel';
import ColorButton from './components/ColorButton';
import { Cube3DIsometric } from './components/Cube2D/CubeIsometric3D';
import { BlindCyclesPanel } from './components/BlindCyclesPanel';
import { getCubeCycles, type CycleInfo } from '@cube-explorer/shared/src/cube/CubeValidation';



function AppContent() {
  const { selectedColor, setSelectedColor } = useColorContext();
  const { defaultCubeState, setCubeState, cubeState } = useCubeContext();
  const { setInputInvalid } = useScrambleContext();
  const { viewMode, setViewMode } = useViewMode();
  const { solveCube, cancelSolve, clearResults, isSolving, results, error, realTimeLogs } = useSolve();

  // Analyser les cycles - même logique que la validation
  const analyzeCycles = () => {
    try {
      const currentCubeState = cubeState.getCubeState();
      const cubeCycles = getCubeCycles(currentCubeState);
      return cubeCycles;
    } catch (error) {
      return null;
    }
  };

  const cycles = analyzeCycles();

  // Function to determine if a cubie should be rendered for the L-shape
  // Based on the image: bottom layer + top layer + left column of middle layer
  /* const isCubiePresent = (x: number, y: number, _z: number): boolean => { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Bottom layer (y=0) - all 9 cubies
    if (y === 0) return true;
    
    // Top layer (y=2) - all 9 cubies  
    if (y === 2) return true;
    
    // Middle layer (y=1) - only leftmost column (x=0)
    if (y === 1 && x === 0) return true;
    
    return false;
  }; */



  // 3x3x3 Rubik's Cube component for rotating view
  /* const RubiksCube3x3 = ({ cubeState }: { cubeState: Record<string, string[]> }) => {
    return (
      <RubiksCube3x3Base cubeStateFor3D={cubeState} />
    );
  };*/

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-2">
      <div className="bg-white shadow-lg rounded-lg flex w-full max-w-7xl">
        {/* Main Cube Display - Left side */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="bg-gray-200 border border-gray-400 rounded p-6 h-full flex items-center justify-center relative" style={{paddingLeft: '80px', paddingRight: '80px'}}>
            {/* View Mode Selector - Overlay on the left */}
            <div className="absolute left-2 top-2 flex flex-col space-y-1 bg-white border border-gray-300 rounded p-2 shadow-sm">
              <ControlButton label="2D" onClick={() => setViewMode('2d')} className="text-xs px-2 py-1" />
              <div className="border-t border-gray-200"></div>
              <ControlButton label="3D-I" onClick={() => setViewMode('3d-isometric')} className="text-xs px-2 py-1" />
              <div className="border-t border-gray-200"></div>
              <ControlButton label="3D-R" onClick={() => setViewMode('3d-rotating')} className="text-xs px-2 py-1" />
            </div>

            {/* Color Selector - Overlay on the right */}
            <div className="absolute right-2 top-2 bg-white border border-gray-300 rounded p-3 shadow-sm">
              <div className="text-xs font-semibold text-gray-700 mb-2 text-center">Colors</div>
              <div className="flex flex-col space-y-1">
                {colors.map((color) => (
                  <ColorButton 
                    key={color.value} 
                    color={color.value} 
                    onClick={() => setSelectedColor(color.value)}
                    isSelected={selectedColor === color.value}
                  />
                ))}
              </div>
            </div>

            {/* Reset To - Overlay on the bottom left */}
            <div className="absolute left-2 bottom-2 bg-white border border-gray-300 rounded p-2 shadow-sm">
              <div className="text-xs font-semibold text-gray-700 mb-2 text-center">Reset To</div>
              <div className="grid grid-cols-3 gap-1">
                <ControlButton label="Empty" onClick={() => {/* TODO: Implement empty cube */}} />
                <ControlButton label="Clean" onClick={() => {
                  setCubeState(defaultCubeState);
                  setInputInvalid(false); // Reset invalid state when cleaning
                }} />
                <ControlButton label="Random" onClick={() => {/* TODO: Implement random cube */}} />
              </div>
            </div>

            {/* Add and Generate - Overlay on the bottom right */}
            <div className="absolute right-2 bottom-2">
              <ControlButton 
                label={isSolving ? "Solving..." : "Find solutions"} 
                onClick={solveCube}
                disabled={isSolving}
                className={`px-3 py-1 text-sm rounded shadow-lg transition-all ${isSolving 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-xl'
                }`}
              />
            </div>

            {viewMode === '2d' && (
              <Cube2D />
            )}

            {viewMode === '3d-isometric' && (
              <Cube3DIsometric />
            )}

            {viewMode === '3d-rotating' && (
              <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                {/* <RubiksCube3x3 cubeState={cubeState} /> */}
                Not implemented
                <OrbitControls />
              </Canvas>
            )}
          </div>

          {/* Control Buttons - Under the cube */}
          <div className="mt-4 flex flex-col space-y-4">
            {/* Apply Move Section */}
            <div>
              <MoveCubeButtons />
            </div>

            {/* Scramble Input */}
            <ScrambleInput />

            {/* Solve Buttons */}
            <div className="flex justify-center space-x-3">
              {isSolving && (
                <ControlButton 
                  label="Cancel" 
                  onClick={cancelSolve}
                  className="px-6 py-2 bg-red-600 text-white hover:bg-red-700"
                />
              )}
            </div>

            {/* Test Cancel Button */}
            <div className="flex justify-center mt-2">
              <ControlButton 
                label="Test Cancel" 
                onClick={async () => {
                  const controller = new AbortController();
                  try {
                    const response = await fetch('http://localhost:3001/api/test-cancel', {
                      signal: controller.signal
                    });
                    const data = await response.json();
                    console.log('Test result:', data);
                  } catch (error) {
                    if (error instanceof Error && error.name === 'AbortError') {
                      console.log('Test was cancelled');
                    } else {
                      console.error('Test error:', error);
                    }
                  }
                }}
                className="px-4 py-1 bg-blue-600 text-white hover:bg-blue-700 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results Panel - Right side */}
        <div className="w-96 p-4 border-l border-gray-300 flex flex-col">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Results</h2>

          <BackendStatus />

          {/* Results Panel */}
          <ResultsPanel
            results={results}
            isSolving={isSolving}
            error={error}
            onClearResults={clearResults}
            realTimeLogs={realTimeLogs}
          />

          {/* Progress */}
          <div className="text-xs text-gray-600 text-center mt-4">
            Ready to solve
          </div>
        </div>
      </div>

      {/* Blind Cycles Panel - Full width below the main content */}
      {cycles && (
        <div className="w-full max-w-7xl p-4 bg-gray-50 border-t border-gray-300 mt-4 rounded-lg">
          <BlindCyclesPanel 
            cornerCycles={cycles.cornerCycles}
            edgeCycles={cycles.edgeCycles}
          />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <CubeProvider>
      <ColorProvider>
        <ScrambleProvider>
          <AppContent />
        </ScrambleProvider>
      </ColorProvider>
    </CubeProvider>
  );
}

export default App;