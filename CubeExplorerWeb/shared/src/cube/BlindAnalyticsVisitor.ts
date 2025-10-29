import { CubeVisitor } from "./CubeVisitor";
import { Corner, Edge, getCornerOrientation, getCubieName, getEdgeOrientation, isEdge } from "./Cubies";

type CubieInfo = {
    name: string,
    orientation: number,
}

type CycleResult = string

type GroupResult = {
    cycles: string[],
    orientations: string[],
}

type CubeResult = undefined

export class BlindAnalyticsVisitor extends CubeVisitor<CubieInfo, CycleResult, GroupResult, CubeResult> {
    private static instance: BlindAnalyticsVisitor | null = null;
    private constructor() {
        super();
    }

    protected cubieInfo<C extends Edge | Corner>({ cubie, initialPosition }: { cubie: C; initialPosition: C }): CubieInfo {
        const cubeStateToUse = this.cubeState!.getCubeState();
        return {
            name: getCubieName(cubie),
            orientation: isEdge(cubie) ? getEdgeOrientation(cubie, initialPosition, cubeStateToUse) : getCornerOrientation(cubie, cubeStateToUse),
        };
    }

    protected cycleResult<C extends Edge | Corner>(cycleResultInput: { cubieInfo: { cubie: C; info: CubieInfo }; accumulator: CycleResult }): CycleResult {
        if (cycleResultInput.accumulator.length === 0) {
            return `${cycleResultInput.cubieInfo.info.name}: ${cycleResultInput.cubieInfo.info.orientation}`;
        } else {
            const accs = cycleResultInput.accumulator.split(":");
            return `${accs[0]} → ${cycleResultInput.cubieInfo.info.name}`;
        }
    }

    protected groupResult<C extends Edge | Corner>({ cycle, accumulator }: { cycle: {
        cubies: { cubie: C; info: CubieInfo }[];
        cycleResult: CycleResult;
    }; accumulator: GroupResult }): GroupResult {
        if (cycle.cycleResult.includes(":")) {
            accumulator.orientations.push(cycle.cycleResult);
        } else {
            accumulator.cycles.push(cycle.cycleResult);
        }
        return accumulator;
    }

    protected cubeResult(): CubeResult {
       return;
    }

    protected initialCycleAccumulator(): CycleResult {
        return '';
    }

    protected initialGroupAccumulator(): GroupResult {
        return { cycles: [], orientations: [] };
    }

    protected initialCubeAccumulator(): CubeResult {
        return undefined;
    }

    public static getInstance(): BlindAnalyticsVisitor {
        if (!BlindAnalyticsVisitor.instance) {
            BlindAnalyticsVisitor.instance = new BlindAnalyticsVisitor();
        }
        return BlindAnalyticsVisitor.instance;
    }
}