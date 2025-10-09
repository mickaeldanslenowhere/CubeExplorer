import { useState } from "react";

export default function useViewMode() {
    const [viewMode, setViewMode] = useState<'2d' | '3d-isometric' | '3d-rotating'>('2d');

    return {
        viewMode,
        setViewMode
    }
}