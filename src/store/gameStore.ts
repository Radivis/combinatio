import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { game, gameRow, hints, modal, settings } from '../interfaces/interfaces';
import {
    defaultNumColors,
    defaultNumColumns,
    defaultNumRows,
    gameStates,
    holeHue,
    holeLightness,
    holeSaturation,
    paletteNames
} from '../constants';
import Colors from '../util/Colors';
import Color from '../util/Color';
import { colorsDataString } from '../interfaces/types';
import { range } from '../util/range';
import generateRandomGuess from './functions/generateRandomGuess';
import { generateRegularPalette } from './functions/generatePalette';
import changeSettings from './actions/changeSettings';
import reset from './actions/reset';
import guess from './actions/guess';

export type gameState = {
    settings: settings,
    game: game,
    hints: hints,
    modal: modal,
}

export type gameActions = {
    changeSettings: (newSettings: settings) => void,
    placeColor: ({color, row, column}: {color: Color, row: number, column: number}) => void,
    start: () => void,
    win: () => void,
    lose: () => void,
    reset: () => void,
    randomGuess: () => void,
    guess: () => void,
    resetHints: () => void,
    toggleDisableColor: (color: Color) => void,
    setPossibleColors: (colors: Colors, columnIndex: number) => void,
    setColorMinMax: ({colorIndex, min, max}: {colorIndex: number, min?: number, max?: number}) => void,
    placeTupleColor: ({color, rowIndex, columnIndex}: {color: Color, rowIndex: number, columnIndex: number}) => void,
    addColorTuple: () => void,
    addColorTupleSlot: (rowIndex: number) => void,
    deleteColorTupleRow: (rowIndex: number) => void,
    changeCombinationNote: (rowIndex: number, newNote: string) => void,
    setModal: (modal: modal) => void,
}

// Doesn't seem to work!
// const executeAction = (get: () => gameActions, action: keyof gameActions, params?: any[]) => {
//     setTimeout(() => get()[action], 1);
// }

export const defaultRowColorsDataString = (numColumns: number): colorsDataString => Colors.serialize(new Colors(
    {
        color: new Color(holeHue, holeSaturation, holeLightness),
        length: numColumns
    }
));

export const initializeGameRows = (numRows: number, numColumns: number): gameRow[] => range(numRows + 1)
.map((_rowIndex: number) => {
    return {
        rowColorsDataString: defaultRowColorsDataString(numColumns),
        numCorrectColor: 0,
        numFullyCorrect: 0,
    }
})

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

const resetHintsCallback = (set: Function, get: Function) => {
    const settings = get().settings;
    const { numColors, numColumns, maxIdenticalColorsInSolution } = settings;
    set((state: gameState) => {
        const blankHints = {
            colorsMinMax: Array(numColors).fill([...[0, maxIdenticalColorsInSolution]]),
            possibleSlotColorsDataStrings: Array(numColumns)
            .fill(state.game.paletteColorsDataString),
            disabledColorsDataString: '[]',
            combinationNotes: Array(2).fill([defaultRowColorsDataString(2), '']),
        }
        state.hints = blankHints;
        state.hints.colorsMinMax = blankHints.colorsMinMax;
    }, false, 'resetHints');
}

const useGameStore = create<gameState & gameActions>()(
    devtools(immer((set, get) => ({
        settings: initialGameState.settings,
        game: initialGameState.game,
        hints: initialGameState.hints,
        modal: initialGameState.modal,
        changeSettings: changeSettings(set, get),
        placeColor: ({color, row, column}: {color: Color, row: number, column: number}) => {
            const rowColors: Colors = Colors.deserialize(get().game.gameRows[row].rowColorsDataString);
            rowColors[column] = color;
            set((state: gameState) => {
                state.game.gameRows[row].rowColorsDataString = Colors.serialize(rowColors);
            }, false, 'placeColor');
        },
        start: () => {
            set((state: gameState) => {
                state.game.gameState = gameStates[1];
            }, false, 'start')
        },
        win: () => {
            set((state: gameState) => {
                state.game.gameState = gameStates[2];
                state.game.activeRowIndex = -1;
            }, false, 'win')
        },
        lose: () => {
            set((state: gameState) => {
                state.game.gameState = gameStates[3];
                state.game.activeRowIndex = -1;
            }, false, 'lose')
        },
        reset: reset(set, get),
        randomGuess: () => {
            const state = get();
            // Generate random guess
            const randomGuess = generateRandomGuess(state);
            // Place random guess in the currely active game row
            set((state: gameState) => {
                state.game.gameRows[state.game.activeRowIndex].rowColorsDataString = Colors.serialize(randomGuess);
            }, false, 'randomGuess')
        },
        guess: guess(set, get),
        toggleDisableColor: (color: Color) => {
            const state = get();
            const disabledColors = Colors.deserialize(state.hints.disabledColorsDataString);
            // get color index
            const paletteColors = Colors.deserialize(state.game.paletteColorsDataString);
            const colorIndex = paletteColors.indexOfColor(color);
            set((state: gameState) => {
                if (disabledColors.has(color)) {
                    // Enable color
                    disabledColors.remove(color);
                    // set max of this color to absolute max
                    state.hints.colorsMinMax[colorIndex][1] = state.settings.maxIdenticalColorsInSolution;
                } else {
                    // disable color
                    disabledColors.add(color);
                    // set min and max of this color to 0
                    state.hints.colorsMinMax[colorIndex][0] = 0;
                    state.hints.colorsMinMax[colorIndex][1] = 0;
                    // remove this color from the possibleSlotColors for all slots
                    state.hints.possibleSlotColorsDataStrings.forEach((possibleSlotColorsDataString, index) => {
                        const possibleSlotColors = Colors.deserialize(possibleSlotColorsDataString);
                        possibleSlotColors.remove(color);
                        state.hints.possibleSlotColorsDataStrings[index] = Colors.serialize(possibleSlotColors);
                    })
                }
                state.hints.disabledColorsDataString = Colors.serialize(disabledColors);
            }, false, 'toggleDisableColor');
        },
        setPossibleColors: (colors: Colors, columnIndex: number) => {
            set((state: gameState) => {
                const paletteColors = Colors.deserialize(state.game.paletteColorsDataString);
                const { colorsMinMax } = state.hints;

                // Set the possible colors to the provided Colors instance
                state.hints.possibleSlotColorsDataStrings[columnIndex] = Colors.serialize(colors);

                // Increment the min of a color to the number of slots in which it appears certainly

                // First figure out how many certain slots are there for each color
                const colorCertainSlotNumberPairs = paletteColors
                    .map((color: Color): [Color, number] => {
                        return [color, 0];
                    })
                const { possibleSlotColorsDataStrings } = state.hints;
                const { numColumns } = state.settings;
                for (let _columnIndex = 0; _columnIndex < numColumns; _columnIndex++) {
                    const possibleSlotColors = Colors.deserialize(possibleSlotColorsDataStrings[_columnIndex]);
                    if (possibleSlotColors.length === 1) {
                        const certainColor = possibleSlotColors[0];
                        // Increment the corresponding colorCertainSlotNumberPair
                        const colorCertainSlotNumberPair = colorCertainSlotNumberPairs
                            .find((colorCertainSlotNumberPair: [Color, number]) => {
                            return certainColor.equals(colorCertainSlotNumberPair[0]);
                        })!;
                        colorCertainSlotNumberPair[1]++;
                    }
                }

                // Actually increment the min numbers of each color

                paletteColors.forEach((color) => {
                    const colorCertainSlotNumberPair = colorCertainSlotNumberPairs.find((colorCertainSlotNumberPair: [Color, number]) => {
                        return color.equals(colorCertainSlotNumberPair[0])})!;
                    const numCertainSlots = colorCertainSlotNumberPair[1];
                    const colorIndex = paletteColors.indexOfColor(color);
                    const colorMin = colorsMinMax[colorIndex][0];
                    if (colorMin < numCertainSlots) {
                        colorsMinMax[colorIndex][0] = numCertainSlots;
                    }
                });
            }, false, 'setPossibleColors')
        },
        resetHints: () => resetHintsCallback(set, get),
        setColorMinMax: ({colorIndex, min, max}: {colorIndex: number, min?: number, max?: number}) => {
            set((state: gameState) => {
                if (min !== undefined) {
                    state.hints.colorsMinMax[colorIndex][0] = min;
                }
                if (max !== undefined) {
                    // Enable color, if max was 0 and is set to a different value
                    if (state.hints.colorsMinMax[colorIndex][1] === 0 && max !== 0) {
                        const paletteColors = Colors.deserialize(state.game.paletteColorsDataString);
                        const disabledColors = Colors.deserialize(state.hints.disabledColorsDataString);
                        const color = paletteColors[colorIndex];
                        if (disabledColors.has(color)) {
                            disabledColors.remove(color);
                            state.hints.disabledColorsDataString = Colors.serialize(disabledColors);
                        }
                    }
                    state.hints.colorsMinMax[colorIndex][1] = max;
                    // Disable color, if max is set to 0
                    if (max === 0) {
                        const paletteColors = Colors.deserialize(state.game.paletteColorsDataString);
                        const disabledColors = Colors.deserialize(state.hints.disabledColorsDataString);
                        const color = paletteColors[colorIndex];
                        if (!disabledColors.has(color)) {
                            disabledColors.add(color);
                            state.hints.disabledColorsDataString = Colors.serialize(disabledColors);
                        }
                        // remove this color from the possibleSlotColors for all slots
                        // Note: This is a duplication of the code in toggleDisableColor
                        // TODO: Check whether this can be solved via some kind of "reaction"
                        state.hints.possibleSlotColorsDataStrings.forEach((possibleSlotColorsDataString, index) => {
                        const possibleSlotColors = Colors.deserialize(possibleSlotColorsDataString);
                        possibleSlotColors.remove(color);
                        state.hints.possibleSlotColorsDataStrings[index] = Colors.serialize(possibleSlotColors);
                    })
                    }
                }
            }, false, 'setColorMinMax');
        },
        placeTupleColor: ({color, rowIndex, columnIndex}: {color: Color, rowIndex: number, columnIndex: number}) => {
            const { combinationNotes } = get().hints;
            const colorTuple = Colors.deserialize(combinationNotes[rowIndex][0]);
            colorTuple[columnIndex] = color;
            set((state: gameState) => {
                state.hints.combinationNotes[rowIndex][0] = Colors.serialize(colorTuple);
            }, false, 'placeTupleColor');
        },
        addColorTuple: () => {
            set((state: gameState) => {
                state.hints.combinationNotes
                .push([defaultRowColorsDataString(2),'']);
            }, false, 'addColorTuple')
        },
        addColorTupleSlot: (rowIndex: number) => {
            set((state: gameState) => {
                const colorTuple = Colors.deserialize(state.hints.combinationNotes[rowIndex][0]);
                colorTuple.push(new Color(holeHue, holeSaturation, holeLightness));
                state.hints.combinationNotes[rowIndex][0] = Colors.serialize(colorTuple);
            }, false, 'addColorTuple')
        },
        deleteColorTupleRow: (rowIndex: number) => {
            set((state: gameState) => {
                state.hints.combinationNotes = state.hints.combinationNotes
                    .filter((combinationNote: [string, string], _rowIndex:number) => {
                        return rowIndex !== _rowIndex;
                    });
            }, false, 'deleteColorTupleRow')
        },
        changeCombinationNote: (rowIndex: number, newNote: string) => {
            set((state: gameState) => {
                state.hints.combinationNotes[rowIndex][1] = newNote;
            }, false, 'changeCombinationNote')
        },
        setModal: (modal: modal) => {
            set((state: gameState) => {
                state.modal = modal;
            }, false, 'setModal')
        },
    })))
);

export default useGameStore;