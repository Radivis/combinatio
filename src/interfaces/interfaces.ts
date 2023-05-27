import { colorsDataString } from "./types";

export interface hslColorObject {
    hue: number;
    saturation: number;
    lightness: number;
}

export interface settings {
    numColors: number,
    numRows: number,
    palette: colorsDataString,
}