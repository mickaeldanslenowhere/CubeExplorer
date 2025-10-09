export const Colors = {
    WHITE: 'white',
    YELLOW: 'yellow',   
    RED: 'red',
    ORANGE: 'orange',
    GREEN: 'green',
    BLUE: 'blue'
} as const;

export type Color = typeof Colors[keyof typeof Colors];

export const colors: { name: string, value: Color, bg: string }[] = [
    { name: 'White', value: Colors.WHITE, bg: 'bg-white' },
    { name: 'Yellow', value: Colors.YELLOW, bg: 'bg-yellow-400' },
    { name: 'Red', value: Colors.RED, bg: 'bg-red-500' },
    { name: 'Orange', value: Colors.ORANGE, bg: 'bg-orange-500' },
    { name: 'Green', value: Colors.GREEN, bg: 'bg-green-500' },
    { name: 'Blue', value: Colors.BLUE, bg: 'bg-blue-500' }
];

export function getColor(color: Color) {
    const colorValue = colors.find(c => c.value === color)
    if (!colorValue) {
        throw new Error(`Color ${color} not found`);
    }
    return {
        name: colorValue?.name,
        bg: colorValue?.bg
    }
}