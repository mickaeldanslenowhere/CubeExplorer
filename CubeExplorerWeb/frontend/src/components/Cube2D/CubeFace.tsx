import { getColor } from "../../hooks/useColors";
import { useCubeContext, useColorContext } from "../../hooks/useContexts";

type CubeFaceProps = {
    face: "up" | "down" | "front" | "back" | "left" | "right";
}

export const CubeFace = ({ face }: CubeFaceProps) => {
    const { cubeState, setCubeState } = useCubeContext();
    const { selectedColor, setSelectedColor } = useColorContext();
    return (
        <div className="grid grid-cols-3 border border-gray-600">
            {cubeState[face].map((color, index) => (
                <div
                    key={index}
                    className={`w-6 h-6 border border-gray-600 cursor-pointer ${getColor(color).bg}`}
                    onClick={() => {
                        // If it's a center facelet (index 4), select its color
                        if (index === 4) {
                          setSelectedColor(color);
                          console.log(`Selected color from center facelet: ${color}`);
                        } else {
                          // Otherwise, change the facelet's color
                          const newColors = [...cubeState[face]];
                          newColors[index] = selectedColor;
                          setCubeState({...cubeState, [face]: newColors});
                          console.log(`Updated ${face} face at position ${index} to ${selectedColor}`);
                        }
                      }}
                />
            ))}
        </div>
    )
}