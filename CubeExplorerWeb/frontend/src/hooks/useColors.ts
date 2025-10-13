import { type CubeFacet, CubeFacets } from "@cube-explorer/shared/src/cube/CubeFacet";

export const colors: { name: string, value: CubeFacet, bg: string }[] = [
    { name: 'White', value: CubeFacets.WHITE, bg: 'bg-white' },
    { name: 'Yellow', value: CubeFacets.YELLOW, bg: 'bg-yellow-400' },
    { name: 'Red', value: CubeFacets.RED, bg: 'bg-red-500' },
    { name: 'Orange', value: CubeFacets.ORANGE, bg: 'bg-orange-500' },
    { name: 'Green', value: CubeFacets.GREEN, bg: 'bg-green-500' },
    { name: 'Blue', value: CubeFacets.BLUE, bg: 'bg-blue-500' },
    { name: 'X_Wildcard', value: CubeFacets.X_WILDCARD, bg: 'bg-gray-400' }
];

export function getColor(color: CubeFacet) {
    const colorValue = colors.find(c => c.value === color)
    if (!colorValue) {
        throw new Error(`Color ${color} not found`);
    }
    return {
        name: colorValue?.name,
        bg: colorValue?.bg
    }
}