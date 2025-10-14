import { FinalTwoPhaseSolver } from './FinalTwoPhaseSolver';
import { CancellationManager } from '../utils/CancellationManager';
import { Logger } from '../utils/Logger';
import CubeState, { CubeStateType } from '@cube-explorer/shared/src/cube/CubeState';
import { isValidCubeState } from '@cube-explorer/shared/src/cube/CubeValidation';

export class SolveService {


  /**
   * Solve a cube from a cubeState object with real-time logs
   * @param cubeState - The cube state object
   */
  static async solveCubeWithLogs(cubeState: CubeStateType): Promise<{ resolution: string }> {
    const startTime = Date.now();
    Logger.log(`🔧 Starting cube solving for cubeState`, { sendToFrontend: true });
    Logger.log('🧪 Testing cubeState');
    
    try {
      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        Logger.error('Operation was cancelled by user', { sendToFrontend: true });
        return { resolution: 'Operation cancelled by user' };
      }
      
      // Validate the cubeState
      const validationStartTime = Date.now();
      if (!isValidCubeState(cubeState)) {
        throw new Error('Invalid cubeState format');
      }
      const validationTime = Date.now() - validationStartTime;
      Logger.info(`CubeState validation completed in ${validationTime}ms`, { sendToFrontend: true });

      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        Logger.error('Operation was cancelled by user', { sendToFrontend: true });
        return { resolution: 'Operation cancelled by user' };
      }

      // Convert cubeState to CubeState object
      const conversionStartTime = Date.now();

      Logger.log(`🔄 Converting cubeState to CubeState object`);
    
      // Create a CubeState object from the received cubeState
      const cubeStateObj = new CubeState();
      cubeStateObj.setCubeState(cubeState);
      Logger.log(`📊 Frontend cube state: ${cubeStateObj.toString()}`);

      const conversionTime = Date.now() - conversionStartTime;
      Logger.info(`CubeState converted in ${conversionTime}ms`, { sendToFrontend: true });
      
      // Check if operation was cancelled
      if (CancellationManager.isCancelled) {
        Logger.error('Operation was cancelled by user', { sendToFrontend: true });
        return { resolution: 'Operation cancelled by user' };
      }
      
      // Use the Two-Phase Algorithm to solve the cube
      const solvingStartTime = Date.now();
      const solution = await FinalTwoPhaseSolver.solveWithLogs(cubeStateObj);
      const solvingTime = Date.now() - solvingStartTime;
      
      // Check if solution was cancelled (empty array)
      if (solution.length === 0) {
        Logger.error('Operation was cancelled by user during solving', { sendToFrontend: true });
        return { resolution: 'Operation cancelled by user' };
      }
      
      Logger.info(`Two-Phase Algorithm completed in ${solvingTime}ms with solution: [${solution.join(', ')}]`, { sendToFrontend: true });
      
      // Convert solution array to string
      const resolution = solution.join(' ');
      
      const totalTime = Date.now() - startTime;
      Logger.info(`Total solving time: ${totalTime}ms`, { sendToFrontend: true });
      
      return {
        resolution: resolution || 'No solution found'
      };
    } catch (error) {
      const totalTime = Date.now() - startTime;
      const errorMessage = `❌ Error solving cube after ${totalTime}ms: ${error}`;
      Logger.error(errorMessage, { sendToFrontend: true });
      return {
        resolution: 'Error: Unable to solve cube'
      };
    }
  }





}