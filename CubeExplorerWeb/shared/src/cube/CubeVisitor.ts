import CubeState from "./CubeState";
import { Corner, Edge } from "./Cubies";

type CubieInfoInput<Cubie extends Edge | Corner> = {
    cubie: Cubie;
    initialPosition: Cubie;
}

type Cubix<C extends Edge | Corner, CubieInfo> = {
    cubie: C;
    info: CubieInfo;
}

type CycleResultInput<Cubie extends Edge | Corner, CubieInfo, CycleResult> = {
    cubieInfo: Cubix<Cubie, CubieInfo>;
    accumulator: CycleResult;
}

type Cyclix<C extends Edge | Corner, CubieInfo, CycleResult> = {
    cubies: Cubix<C, CubieInfo>[];
    cycleResult: CycleResult;
}

type GroupResultInput<Cubie extends Edge | Corner, CubieInfo, CycleResult, GroupResult> = {
    cycle: Cyclix<Cubie, CubieInfo, CycleResult>;
    accumulator: GroupResult;
}

type CubeResultInput<CubieInfo, CycleResult, GroupResult, CubeResult> = {
    corners: {
        cycles: Cyclix<Corner, CubieInfo, CycleResult>[];
        cornersResult: GroupResult;
    };
    edges: {
        cycles: Cyclix<Edge, CubieInfo, CycleResult>[];
        edgesResult: GroupResult;
    };
    accumulator: CubeResult;
}

export abstract class CubeVisitor<CubieInfo, CycleResult, GroupResult, CubeResult> {
    protected cubeState: CubeState | null = null;
    // abstract function that works with a cubie
    protected abstract cubieInfo<Cubie extends Edge | Corner>(cubieInfoInput: CubieInfoInput<Cubie>): CubieInfo;

    // abstract function that works with a cycle
    protected abstract cycleResult<Cubie extends Edge | Corner>(cycleResultInput: CycleResultInput<Cubie, CubieInfo, CycleResult>): CycleResult;

    // abstract function that works with a cube
    protected abstract groupResult<Cubie extends Edge | Corner>(groupResultInput: GroupResultInput<Cubie, CubieInfo, CycleResult, GroupResult>): GroupResult;

    // abstract function that works with a cube
    protected abstract cubeResult(cubeResultInput: CubeResultInput<CubieInfo, CycleResult, GroupResult, CubeResult>): CubeResult;


    protected abstract initialCycleAccumulator(): CycleResult;
    protected abstract initialGroupAccumulator(): GroupResult;
    protected abstract initialCubeAccumulator(): CubeResult;

    visit(cubeState: CubeState, cornerBuffer?: Corner, edgeBuffer?: Edge) {
        return this.innerVisit(cubeState, cornerBuffer, edgeBuffer);
    }
    
    private innerVisit(cubeState: CubeState, cornerBuffer?: Corner, edgeBuffer?: Edge): {
        result: CubeResult;
        corners: {
            cycles: Cyclix<Corner, CubieInfo, CycleResult>[];
            cornersResult: GroupResult;
        };
        edges: {
            cycles: Cyclix<Edge, CubieInfo, CycleResult>[];
            edgesResult: GroupResult;
        };
    } {
        if (!cubeState) {
            return {
                result: this.initialCubeAccumulator(),
                corners: { cycles: [], cornersResult: this.initialGroupAccumulator() },
                edges: { cycles: [], edgesResult: this.initialGroupAccumulator() },
            }
        }
        this.cubeState = cubeState;
        const cornersCycles = cubeState.getCornersCycles(cornerBuffer);
        const edgesCycles = cubeState.getEdgesCycles(edgeBuffer);
        const corners: {
            cycles: Cyclix<Corner, CubieInfo, CycleResult>[];
            cornersResult: GroupResult;
        } = {
            cycles: [],
            cornersResult: this.initialGroupAccumulator(),
        };
        const edges: {
            cycles: Cyclix<Edge, CubieInfo, CycleResult>[];
            edgesResult: GroupResult;
        } = {
            cycles: [],
            edgesResult: this.initialGroupAccumulator(),
        };
        for (const cycle of cornersCycles) {
            const cycleResult = cycle.visit(this.cubieInfo.bind(this), this.cycleResult.bind(this), this.initialCycleAccumulator());
            corners.cycles.push(cycleResult);
            corners.cornersResult = this.groupResult({ cycle: cycleResult, accumulator: corners.cornersResult });
        }
        for (const cycle of edgesCycles) {
            const cycleResult = cycle.visit(this.cubieInfo.bind(this), this.cycleResult.bind(this), this.initialCycleAccumulator());
            edges.cycles.push(cycleResult);
            edges.edgesResult = this.groupResult({ cycle: cycleResult, accumulator: edges.edgesResult });
        }
        const result = this.cubeResult({ corners, edges, accumulator: this.initialCubeAccumulator() });
        this.cubeState = null;
        return {
            result,
            corners,
            edges,
        };
    }
}