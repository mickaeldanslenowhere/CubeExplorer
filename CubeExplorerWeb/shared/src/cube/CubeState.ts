import { CubeFacet, CubeFacets } from "./CubeFacet";

type CubeStateType = {
  up: CubeFacet[];
  front: CubeFacet[];
  down: CubeFacet[];
  back: CubeFacet[];
  left: CubeFacet[];
  right: CubeFacet[];
}

const defaultCubeState: CubeStateType = {
  up: [CubeFacets.WHITE, CubeFacets.WHITE, CubeFacets.WHITE, CubeFacets.WHITE, CubeFacets.WHITE, CubeFacets.WHITE, CubeFacets.WHITE, CubeFacets.WHITE, CubeFacets.WHITE],
  front: [CubeFacets.GREEN, CubeFacets.GREEN, CubeFacets.GREEN, CubeFacets.GREEN, CubeFacets.GREEN, CubeFacets.GREEN, CubeFacets.GREEN, CubeFacets.GREEN, CubeFacets.GREEN],
  down: [CubeFacets.YELLOW, CubeFacets.YELLOW, CubeFacets.YELLOW, CubeFacets.YELLOW, CubeFacets.YELLOW, CubeFacets.YELLOW, CubeFacets.YELLOW, CubeFacets.YELLOW, CubeFacets.YELLOW],
  back: [CubeFacets.BLUE, CubeFacets.BLUE, CubeFacets.BLUE, CubeFacets.BLUE, CubeFacets.BLUE, CubeFacets.BLUE, CubeFacets.BLUE, CubeFacets.BLUE, CubeFacets.BLUE],
  left: [CubeFacets.ORANGE, CubeFacets.ORANGE, CubeFacets.ORANGE, CubeFacets.ORANGE, CubeFacets.ORANGE, CubeFacets.ORANGE, CubeFacets.ORANGE, CubeFacets.ORANGE, CubeFacets.ORANGE],
  right: [CubeFacets.RED, CubeFacets.RED, CubeFacets.RED, CubeFacets.RED, CubeFacets.RED, CubeFacets.RED, CubeFacets.RED, CubeFacets.RED, CubeFacets.RED]
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
      up: [...this.cubeState.up],
      front: [...this.cubeState.front],
      down: [...this.cubeState.down],
      back: [...this.cubeState.back],
      left: [...this.cubeState.left],
      right: [...this.cubeState.right],
    }
  }

  clone() {
    const cubeState = this.getDeepCopy();
    const result = new CubeState();
    result.setCubeState(cubeState);
    return result;
  }

  toString() {
    const faces = ['up', 'front', 'down', 'back', 'left', 'right'] as const;
    let result = '';
    
    for (const face of faces) {
      const firstLetters = this.cubeState[face].map(color => color.charAt(0).toUpperCase());
      result += `${face.toUpperCase()}: [${firstLetters.join(' ')}] `;
    }
    
    return result.trim();
  };

  isSolved() {
    for (const face of Object.keys(this.cubeState)) {
      const centerColor = this.cubeState[face as keyof CubeStateType][4];
      if (!this.cubeState[face as keyof CubeStateType].every(color => color === centerColor)) {
        return false;
      }
    }
    return true;
  }
}

export {
  CubeStateType,
  defaultCubeState,
};