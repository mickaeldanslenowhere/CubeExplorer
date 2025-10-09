type ControlButtonProps = {
    onClick: () => void;
    label: string;
}

export default function ControlButton({ onClick, label }: ControlButtonProps) {
    return (
        <button className="px-2 py-1 bg-gray-300 text-gray-800 text-xs border border-gray-400 hover:bg-gray-400" onClick={onClick}>
            {label}
        </button>
    )
}