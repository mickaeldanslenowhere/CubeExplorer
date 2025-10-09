import { Colors } from "./useColors";

export function useColorScheme() {

    const getColorScheme = () => {
        return {
            UColor: Colors.WHITE,
            RColor: Colors.RED,
            FColor: Colors.GREEN,
            DColor: Colors.YELLOW,
            LColor: Colors.ORANGE,
            BColor: Colors.BLUE
        }
    }

    return {
        getColorScheme
    }
}