import { defaultNumColors, defaultNumColumns, defaultNumIcons, defaultNumRows, emptyCombinationNote, gameStates, paletteNames, pieceTypes } from "../constants";
import Colors from "../util/Colors";
import { generateRegularPalette } from "./functions/generatePalette";
import generateDefaultRowColorsDataString from "./functions/generateDefaultRowColorsDataString";
import initializeGameRows from "./functions/initializeGameRows";
import pickIconCollection from "./functions/pickIconCollection";

const initialIconCollection = pickIconCollection(defaultNumIcons);

const initialGameState = {
    displaySettings: {
		areColorAmountHintsActive: true,
        areIconAmountHintsActive: true,
		areSlotHintsActive: true,
        areCombinationNotesActive: true,
        areTranspositionsActive: true,
        isLegendDisplayed: true,
        isRandomGuessButtonDisplayed: true,
        changeMaxOccurrencesOnChangingMinOccurrences: false,
    },
    gameSettings: {
		numColors: defaultNumColors,
        numIcons: defaultNumIcons,
		numRows: defaultNumRows,
		numColumns: defaultNumColumns,
        numPrefilledRows: 0,
		maxIdenticalColorsInSolution: defaultNumColumns,
        maxIdenticalIconsInSolution: defaultNumColumns,
		paletteName: paletteNames[0],
        pieceType: pieceTypes.icon
    },
    game: {
        paletteColorsDataString: generateDefaultRowColorsDataString(defaultNumColors),
        iconCollectionNames: initialIconCollection,
        activeRowIndex: 1,
        solutionColorsDataString: generateDefaultRowColorsDataString(defaultNumColumns),
        solutionIconNames: new Array(defaultNumIcons).fill(''),
        gameRows: initializeGameRows(defaultNumRows, defaultNumColumns),
        gameState: gameStates[0],
        timerSeconds: 0,
    },
    hints: {
        colorsMinMax: Array(defaultNumColors).fill([...[0, defaultNumColumns]]),
        iconsMinMax: Array(defaultNumIcons).fill([...[0, defaultNumColumns]]),
        possibleSlotColorsDataStrings: Array(defaultNumColumns)
            .fill(Colors.serialize(generateRegularPalette(defaultNumColors))),
        possibleSlotIconNames: new Array(defaultNumIcons).fill([...initialIconCollection]),
        disabledColorsDataString: '[]',
        disabledIcons: [],
        combinationNotes: Array(2).fill([...emptyCombinationNote]),
    },
    modal: {
        type: 'none',
        messageHeader: '',
        messageBody: '',
        isVisible: false,
    }
}

export default initialGameState;