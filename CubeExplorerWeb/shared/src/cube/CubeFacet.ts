export const CubeFacet = {
    WHITE: 'white',
    YELLOW: 'yellow',   
    RED: 'red',
    ORANGE: 'orange',
    GREEN: 'green',
    BLUE: 'blue'
} as const;

export type CubeFacet = typeof CubeFacet[keyof typeof CubeFacet];

export const cubeFacets = Object.values(CubeFacet);

export function getCubeFacet(facet: CubeFacet) {
    const facetValue = cubeFacets.find(f => f === facet)
    if (!facetValue) {
        throw new Error(`Cube facet ${facet} not found`);
    }
    return facetValue;
}