import { colorsDataString } from "./types";

export interface hslColorObject {
    hue: number;
    saturation: number;
    lightness: number;
}

export interface game {
    activeRowIndex: number,
    solutionColorsDataString: colorsDataString;
    gameState: string;
    timerSeconds: number;
}

export interface settings {
    numColors: number,
    numRows: number,
    numColumns: number,
    maxIdenticalColorsInSolution: number,
    paletteName: string,
    areColorAmountHintsActive: boolean,
    areSlotHintsActive: boolean,
}