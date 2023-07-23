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
    combinationNotes: [colorsDataString, string][]; 
}

export interface displaySettings {
    areColorAmountHintsActive: boolean,
    areSlotHintsActive: boolean,
    areCombinationNotesActive: boolean,
    isRandomGuessButtonDisplayed: boolean,
}

export interface gameSettings {
    numColors: number,
    numRows: number,
    numColumns: number,
    numPrefilledRows: number,
    maxIdenticalColorsInSolution: number,
    paletteName: string,
}

export interface modal {
    type?: string,
    messageHeader: string,
    messageBody: string,
    isVisible: boolean,
}