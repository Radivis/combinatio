import { colorsDataString } from "./types";

export interface hslColorObject {
    hue: number;
    saturation: number;
    lightness: number;
}

export interface gameRow {
    rowColorsDataString: colorsDataString,
    numCorrectColor: number,
    numFullyCorrect: number,
}

export interface game {
    paletteColorsDataString: colorsDataString;
    activeRowIndex: number,
    solutionColorsDataString: colorsDataString;
    gameRows: gameRow[];
    gameState: string;
    timerSeconds: number;
}

export interface hints {
    colorsMinMax: [number, number][];
    possibleSlotColorsDataStrings: colorsDataString[];
    disabledColorsDataString: colorsDataString;
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