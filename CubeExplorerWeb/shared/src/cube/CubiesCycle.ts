import { Edge, Corner } from "./Cubies";

export default class CubiesCycle<C extends Edge | Corner> {
    private cubies: C[] = [];
    private currentIndex = 0;

    addCubie(cubie: C) {
        this.cubies.push(cubie);
    }

    restart() {
        this.currentIndex = 0;
    }

    next(): C | null {
        if (this.currentIndex >= this.cubies.length) {
            return null;
        }
        const cubie = this.cubies[this.currentIndex];
        this.currentIndex++;
        return cubie;
    }

    previous(): C | null {
        if (this.currentIndex <= 0) {
            return null;
        }
        this.currentIndex--;
        return this.cubies[this.currentIndex];
    }

    visit<T, V>(callback: <C extends Edge | Corner>({
        cubie,
        initialPosition,
    }: {
        cubie: C;
        initialPosition: C;
    }) => T, aggregate:({
        cubieInfo,
        accumulator,
    }: {
        cubieInfo: {
            cubie: C;
            info: T;
        };
        accumulator: V;
    }) => V, initialAccumulator: V): CubiesCycleVisitResult<C, T, V> {
        this.restart();
        let accumulator = initialAccumulator;
        const cubies: { cubie: C; info: T }[] = [];
        let cubie: C | null = this.next();
        while (cubie) {
            const nextCubie = this.next();
            const info = callback({ cubie, initialPosition: nextCubie ?? this.cubies[0] });
            cubies.push({ cubie, info });
            accumulator = aggregate({ cubieInfo: { cubie, info }, accumulator });
            cubie = nextCubie;
        }
        return {
            cubies,
            cycleResult: accumulator,
        };
    }
}

export type CubiesCycleVisitResult<C extends Edge | Corner, T, V> = {
    cubies: { cubie: C; info: T }[];
    cycleResult: V;
}

/* export type CubiesCycleInfos<T> = {
    cycle: CubieCycles;
    infos: T;
    orientations: { [cubieName: string]: number };
} */
