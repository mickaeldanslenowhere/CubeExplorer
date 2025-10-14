import { CubeFace, cubeFaces, CubeFaces } from "./CubeFace";
import { type CubeFacet, CubeFacets } from "./CubeFacet";

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
}

export type {
  CubeStateType,
};
export {
  defaultCubeState,
};