import { type CubeFace } from "./CubeFace";

export type MatrixPoint = {
    face: CubeFace;
    index: number;
}

export type MoveMatrix = {
    [key in CubeFace]: MatrixPoint[];
}
