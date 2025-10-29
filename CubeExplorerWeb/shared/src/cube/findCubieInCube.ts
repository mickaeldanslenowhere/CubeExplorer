import { defaultCubeState, CubeStateType } from "./CubeState";
import { Corner, Edge, isEdge } from "./Cubies";
import { Corners } from "./Cubies";
import { Edges } from "./Cubies";

function findEdgeOnStateInAnother(edge: Edge | null, state1: CubeStateType, state2: CubeStateType) {
    if (!edge) {
      return null;
    }
    const state1Facet1 = state1[edge.facet1.face][edge.facet1.index];
    const state1Facet2 = state1[edge.facet2.face][edge.facet2.index];
    if (state1Facet1 === state1Facet2) {
      return null;
    }
    for (const cubie of Edges) {
      const state2Facet1 = state2[cubie.facet1.face][cubie.facet1.index]
      const state2Facet2 = state2[cubie.facet2.face][cubie.facet2.index]
      if ((state1Facet1 === state2Facet1 && state1Facet2 === state2Facet2) || (state1Facet1 === state2Facet2 && state1Facet2 === state2Facet1))
      return cubie
    }
    return null;
  }
  
  function findCornerOnStateInAnother(corner: Corner | null, state1: CubeStateType, state2: CubeStateType) {
    if (!corner) {
      return null;
    }
    const state1Facet1 = state1[corner.facet1.face][corner.facet1.index];
    const state1Facet2 = state1[corner.facet2.face][corner.facet2.index];
    const state1Facet3 = state1[corner.facet3.face][corner.facet3.index];
    if (state1Facet1 === state1Facet2 || state1Facet1 === state1Facet3 || state1Facet2 === state1Facet3) {
      return null;
    }
    for (const cubie of Corners) {
      const state2Facet1 = state2[cubie.facet1.face][cubie.facet1.index];
      const state2Facet2 = state2[cubie.facet2.face][cubie.facet2.index];
      const state2Facet3 = state2[cubie.facet3.face][cubie.facet3.index];
      if ((state1Facet1 === state2Facet1 && state1Facet2 === state2Facet2 && state1Facet3 === state2Facet3) ||
          (state1Facet1 === state2Facet1 && state1Facet2 === state2Facet3 && state1Facet3 === state2Facet2) ||
          (state1Facet1 === state2Facet2 && state1Facet2 === state2Facet1 && state1Facet3 === state2Facet3) ||
          (state1Facet1 === state2Facet2 && state1Facet2 === state2Facet3 && state1Facet3 === state2Facet1) ||
          (state1Facet1 === state2Facet3 && state1Facet2 === state2Facet1 && state1Facet3 === state2Facet2) ||
          (state1Facet1 === state2Facet3 && state1Facet2 === state2Facet2 && state1Facet3 === state2Facet1)
      ) {
        return cubie
      }
    }
    return null
  }
  
  export function findEdgeInDefaultCube(edge: Edge | null, cubeState: CubeStateType) {
    return findEdgeOnStateInAnother(edge, cubeState, defaultCubeState)
  }
  
  export function findDefaultEdgeInCubeState(edge: Edge | null, cubeState: CubeStateType) {
    return findEdgeOnStateInAnother(edge, defaultCubeState, cubeState)
  }
  
  export function findCornerInDefaultCube(corner: Corner | null, cubeState: CubeStateType) {
    return findCornerOnStateInAnother(corner, cubeState, defaultCubeState)
  }
  
  export function findDefaultCornerInCubeState(corner: Corner | null, cubeState: CubeStateType) {
    return findCornerOnStateInAnother(corner, defaultCubeState, cubeState)
  }

  export function findCubieInDefaultCube<C extends Edge | Corner>(cubie: C, cubeState: CubeStateType): C | null {
    if (isEdge(cubie)) {
      return findEdgeInDefaultCube(cubie, cubeState) as C
    } else {
      return findCornerInDefaultCube(cubie, cubeState) as C
    }
  }