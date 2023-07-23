import { defaultNumColors, defaultNumColumns, defaultNumRows, gameStates, paletteNames } from "../constants";
import Colors from "../util/Colors";
import { generateRegularPalette } from "./functions/generatePalette";
import { defaultRowColorsDataString, initializeGameRows } from "./gameStore";

const initialGameState = {
    settings: {
		numColors: defaultNumColors,
		numRows: defaultNumRows,
		numColumns: defaultNumColumns,
        numPrefilledRows: 0,
		maxIdenticalColorsInSolution: defaultNumColumns,
		paletteName: paletteNames[0],
		areColorAmountHintsActive: true,
		areSlotHintsActive: true,
        areCombinationNotesActive: true,
        isRandomGuessButtonDisplayed: true,
    },
    game: {
        paletteColorsDataString: Colors.serialize(generateRegularPalette(defaultNumColors)),
        activeRowIndex: 1,
        solutionColorsDataString: defaultRowColorsDataString(defaultNumColumns),
        gameRows: initializeGameRows(defaultNumRows, defaultNumColumns),
        gameState: gameStates[0],
        timerSeconds: 0,
    },
    hints: {
        colorsMinMax: Array(defaultNumColors).fill([...[0, defaultNumColumns]]),
        possibleSlotColorsDataStrings: Array(defaultNumColumns)
            .fill(Colors.serialize(generateRegularPalette(defaultNumColors))),
        disabledColorsDataString: '[]',
        combinationNotes: Array(2).fill([defaultRowColorsDataString(2),'']),
    },
    modal: {
        type: 'none',
        messageHeader: '',
        messageBody: '',
        isVisible: false,
    }
}

export default initialGameState;