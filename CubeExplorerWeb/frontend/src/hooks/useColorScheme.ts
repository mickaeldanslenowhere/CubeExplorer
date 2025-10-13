import { CubeFacets } from "@cube-explorer/shared/src/cube/CubeFacet";

export function useColorScheme() {

    const getColorScheme = () => {
        return {
            UColor: CubeFacets.WHITE,
            RColor: CubeFacets.RED,
            FColor: CubeFacets.GREEN,
            DColor: CubeFacets.YELLOW,
            LColor: CubeFacets.ORANGE,
            BColor: CubeFacets.BLUE
        }
    }

    return {
        getColorScheme
    }
}