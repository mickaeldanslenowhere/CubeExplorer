export const Colors = {
    WHITE: 'white',
    YELLOW: 'yellow',   
    RED: 'red',
    ORANGE: 'orange',
    GREEN: 'green',
    BLUE: 'blue'
} as const;

export type Color = typeof Colors[keyof typeof Colors];
