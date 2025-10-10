import { CubeFacet } from "./CubeFacet";

type CubeStateType = {
  up: CubeFacet[];
  front: CubeFacet[];
  down: CubeFacet[];
  back: CubeFacet[];
  left: CubeFacet[];
  right: CubeFacet[];
}

const defaultCubeState: CubeStateType = {
  up: [CubeFacet.WHITE, CubeFacet.WHITE, CubeFacet.WHITE, CubeFacet.WHITE, CubeFacet.WHITE, CubeFacet.WHITE, CubeFacet.WHITE, CubeFacet.WHITE, CubeFacet.WHITE],
  front: [CubeFacet.GREEN, CubeFacet.GREEN, CubeFacet.GREEN, CubeFacet.GREEN, CubeFacet.GREEN, CubeFacet.GREEN, CubeFacet.GREEN, CubeFacet.GREEN, CubeFacet.GREEN],
  down: [CubeFacet.YELLOW, CubeFacet.YELLOW, CubeFacet.YELLOW, CubeFacet.YELLOW, CubeFacet.YELLOW, CubeFacet.YELLOW, CubeFacet.YELLOW, CubeFacet.YELLOW, CubeFacet.YELLOW],
  back: [CubeFacet.BLUE, CubeFacet.BLUE, CubeFacet.BLUE, CubeFacet.BLUE, CubeFacet.BLUE, CubeFacet.BLUE, CubeFacet.BLUE, CubeFacet.BLUE, CubeFacet.BLUE],
  left: [CubeFacet.ORANGE, CubeFacet.ORANGE, CubeFacet.ORANGE, CubeFacet.ORANGE, CubeFacet.ORANGE, CubeFacet.ORANGE, CubeFacet.ORANGE, CubeFacet.ORANGE, CubeFacet.ORANGE],
  right: [CubeFacet.RED, CubeFacet.RED, CubeFacet.RED, CubeFacet.RED, CubeFacet.RED, CubeFacet.RED, CubeFacet.RED, CubeFacet.RED, CubeFacet.RED]
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
    return this.cubeState.up.every(color => color === CubeFacet.WHITE) &&
      this.cubeState.front.every(color => color === CubeFacet.GREEN) &&
      this.cubeState.down.every(color => color === CubeFacet.YELLOW) &&
      this.cubeState.back.every(color => color === CubeFacet.BLUE) &&
      this.cubeState.left.every(color => color === CubeFacet.ORANGE) &&
      this.cubeState.right.every(color => color === CubeFacet.RED);
  }
}

export {
  CubeStateType,
  defaultCubeState,
};