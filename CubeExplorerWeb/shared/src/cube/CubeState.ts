import { BlindAnalyticsVisitor } from "./BlindAnalyticsVisitor";
import { cubeFaces, CubeFaces, type CubeFace } from "./CubeFace";
import { type CubeFacet, CubeFacets } from "./CubeFacet";
import { isValidCubeState } from "./CubeValidation";
import { Corner, Corners, Cubies, Edge, Edges } from "./Cubies";
import CubiesCycle, { CubiesCycleVisitResult } from "./CubiesCycle";
import { findCubieInDefaultCube } from "./findCubieInCube";

type CubeStateType = {
  [key in CubeFace]: CubeFacet[];
}

const defaultCubeState: CubeStateType = {
  [CubeFaces.UP]: [CubeFacets.WHITE, CubeFacets.WHITE, CubeFacets.WHITE, CubeFacets.WHITE, CubeFacets.WHITE, CubeFacets.WHITE, CubeFacets.WHITE, CubeFacets.WHITE, CubeFacets.WHITE],
  [CubeFaces.FRONT]: [CubeFacets.GREEN, CubeFacets.GREEN, CubeFacets.GREEN, CubeFacets.GREEN, CubeFacets.GREEN, CubeFacets.GREEN, CubeFacets.GREEN, CubeFacets.GREEN, CubeFacets.GREEN],
  [CubeFaces.DOWN]: [CubeFacets.YELLOW, CubeFacets.YELLOW, CubeFacets.YELLOW, CubeFacets.YELLOW, CubeFacets.YELLOW, CubeFacets.YELLOW, CubeFacets.YELLOW, CubeFacets.YELLOW, CubeFacets.YELLOW],
  [CubeFaces.BACK]: [CubeFacets.BLUE, CubeFacets.BLUE, CubeFacets.BLUE, CubeFacets.BLUE, CubeFacets.BLUE, CubeFacets.BLUE, CubeFacets.BLUE, CubeFacets.BLUE, CubeFacets.BLUE],
  [CubeFaces.LEFT]: [CubeFacets.ORANGE, CubeFacets.ORANGE, CubeFacets.ORANGE, CubeFacets.ORANGE, CubeFacets.ORANGE, CubeFacets.ORANGE, CubeFacets.ORANGE, CubeFacets.ORANGE, CubeFacets.ORANGE],
  [CubeFaces.RIGHT]: [CubeFacets.RED, CubeFacets.RED, CubeFacets.RED, CubeFacets.RED, CubeFacets.RED, CubeFacets.RED, CubeFacets.RED, CubeFacets.RED, CubeFacets.RED]
}

export default class CubeState {
  private cubeState: CubeStateType;
  constructor() {
    this.cubeState = defaultCubeState;
  }

  getCubeState() {
    return this.cubeState;
  }

  setCubeState(state: CubeStateType) {
    this.cubeState = state;
  }

  getDeepCopy() {
    return {
      [CubeFaces.UP]: [...this.cubeState[CubeFaces.UP]],
      [CubeFaces.FRONT]: [...this.cubeState[CubeFaces.FRONT]],
      [CubeFaces.DOWN]: [...this.cubeState[CubeFaces.DOWN]],
      [CubeFaces.BACK]: [...this.cubeState[CubeFaces.BACK]],
      [CubeFaces.LEFT]: [...this.cubeState[CubeFaces.LEFT]],
      [CubeFaces.RIGHT]: [...this.cubeState[CubeFaces.RIGHT]],
    }
  }

  clone() {
    const cubeState = this.getDeepCopy();
    const result = new CubeState();
    result.setCubeState(cubeState);
    return result;
  }

  toString() {
    let result = '';
    
    for (const face of cubeFaces) {
      const firstLetters = this.cubeState[face].map(color => color.charAt(0).toUpperCase());
      result += `${face.toUpperCase()}: [${firstLetters.join(' ')}] `;
    }
    
    return result.trim();
  };

  isSolved() {
    for (const face of cubeFaces) {
      const centerColor = this.cubeState[face as keyof CubeStateType][4];
      if (!this.cubeState[face as keyof CubeStateType].every(color => color === centerColor)) {
        return false;
      }
    }
    return true;
  }

  isValid() {
    return isValidCubeState(this);
  }

  getBlindAnalytics() {
    return BlindAnalyticsVisitor.getInstance().visit(this);
  }

  getCornersCycles() {
    return this.extractCycles(Corners);
  }

  getEdgesCycles() {
    return this.extractCycles(Edges);
  }

  private extractCycles<Cubie extends Edge | Corner>(cubies: Cubie[]): CubiesCycle<Cubie>[] {
    const visitedCubies = new Array(cubies.length).fill(false);
    const cycles: CubiesCycle<Cubie>[] = [];
    while (visitedCubies.includes(false)) {
      const unvisitedIndex = visitedCubies.findIndex(visited => !visited);
      if (unvisitedIndex === -1) break;
      // now, follow the cycle
      let cubieToCheck: Cubie = cubies[unvisitedIndex];
      let cycleLength = 0;
      const cycle = new CubiesCycle<Cubie>();
      let endCycle = false;
      while (!endCycle) {
        const cubieToCheckIndex = cubies.indexOf(cubieToCheck);
        if (visitedCubies[cubieToCheckIndex]) {
          if (cycleLength > 0 && cubieToCheck === cubies[unvisitedIndex]) {
            // back to buffer
            endCycle = true;
            break;
          }
          throw new Error('Unsolvable cube: infinite cycle detected');
        }
        visitedCubies[cubieToCheckIndex] = true;
        cycle.addCubie(cubieToCheck);
        const nextCubie = findCubieInDefaultCube(cubieToCheck, this.cubeState);
        if (nextCubie === null) {
          throw new Error('Cubie not found in default cube state');
        }
        if (nextCubie === cubieToCheck) {
          // cubie is already in the good position
          endCycle = true;
          break;
        }
        cubieToCheck = nextCubie;
        cycleLength++;
      }
      cycles.push(cycle);
    }
    return cycles;
  }
}

export type {
  CubeStateType,
};
export {
  defaultCubeState,
};