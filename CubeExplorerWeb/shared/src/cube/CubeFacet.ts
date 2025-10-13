export const CubeFacets = {
    WHITE: 'white',
    YELLOW: 'yellow',   
    RED: 'red',
    ORANGE: 'orange',
    GREEN: 'green',
    BLUE: 'blue',
    X_WILDCARD: 'x_wildcard'
} as const;

export type CubeFacet = typeof CubeFacets[keyof typeof CubeFacets];

export const cubeFacets = Object.values(CubeFacets);

export function getCubeFacet(facet: CubeFacet) {
    const facetValue = cubeFacets.find(f => f === facet)
    if (!facetValue) {
        throw new Error(`Cube facet ${facet} not found`);
    }
    return facetValue;
}