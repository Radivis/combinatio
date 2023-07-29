import { colorsDataString } from "./types";

export interface hslColorObject {
    hue: number;
    saturation: number;
    lightness: number;
}

export interface gameRow {
    rowColorsDataString: colorsDataString,
    rowIconNames: string[],
    numCorrectColor: number,
    numFullyCorrect: number,
}

export interface game {
    paletteColorsDataString: colorsDataString;
    iconCollectionNames: string[];
    activeRowIndex: number,
    solutionColorsDataString: colorsDataString;
    solutionIconNames: string[];
    gameRows: gameRow[];
    gameState: string;
    timerSeconds: number;
}

export interface hints {
    colorsMinMax: [number, number][];
    possibleSlotColorsDataStrings: colorsDataString[];
    disabledColorsDataString: colorsDataString;
    disabledIcons?: string[];
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
    numIcons: number,
    numRows: number,
    numColumns: number,
    numPrefilledRows: number,
    maxIdenticalColorsInSolution: number,
    maxIdenticalIconsInSolution: number,
    paletteName: string,
    pieceType: string,
}

export interface modal {
    type?: string,
    messageHeader: string,
    messageBody: string,
    isVisible: boolean,
}