type ControlButtonProps = {
    onClick: () => void;
    label: string;
    disabled?: boolean;
    className?: string;
}

export default function ControlButton({ onClick, label, disabled = false, className }: ControlButtonProps) {
    const baseClasses = "px-1 py-1 text-xs border border-gray-400";
    const defaultClasses = "bg-gray-300 text-gray-800 hover:bg-gray-400";
    const disabledClasses = "bg-gray-400 text-gray-500 cursor-not-allowed";
    
    const buttonClasses = disabled 
        ? `${baseClasses} ${disabledClasses}` 
        : `${baseClasses} ${defaultClasses}`;
    
    const finalClasses = className ? className : buttonClasses;

    return (
        <button 
            className={finalClasses} 
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    )
}