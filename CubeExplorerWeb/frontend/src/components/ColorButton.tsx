import { getColor } from "../hooks/useColors";
import type { Color } from "../hooks/useColors";

type ColorButtonProps = {
    color: Color;
    onClick: () => void;
    isSelected?: boolean;
}

export default function ColorButton({ color, onClick, isSelected = false }: ColorButtonProps) {
    const colorInfo = getColor(color);
    
    return (
        <button
            className={`w-8 h-8 border-2 ${colorInfo.bg} ${
                isSelected 
                    ? 'border-gray-800 ring-2 ring-gray-400' 
                    : 'border-gray-300 hover:border-gray-500'
            } transition-all duration-200`}
            onClick={onClick}
            title={colorInfo.name}
        />
    );
}
