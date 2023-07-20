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
import generatePalette, { generateRegularPalette } from './functions/generatePalette';
import generateSolution from './functions/generateSolution';

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

const initializeGameRows = (numRows: number, numColumns: number): gameRow[] => range(numRows + 1)
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
        changeSettings: (newSettings: settings): void => {
            const oldState = get();

            // Generate new colors palette, if necessary
            let gamePaletteDataString = oldState.game.paletteColorsDataString;
            if (oldState.settings.numColors !== newSettings.numColors
            || oldState.settings.paletteName !== newSettings.paletteName) {
                gamePaletteDataString = Colors.serialize(generatePalette(newSettings.numColors, newSettings.paletteName));
            }
            
            set((state: gameState & gameActions) => {
                const {
                    maxIdenticalColorsInSolution,
                    numColumns,
                    numPrefilledRows,
                    numColors,
                    numRows
                } = newSettings;

                state.settings = newSettings;
                
                // reset game state
                state.game.gameState = gameStates[0];
                state.game.activeRowIndex = 1;
                state.game.timerSeconds = 0;

                // Regenerate game
                state.game.paletteColorsDataString = gamePaletteDataString;
                state.game.gameRows = initializeGameRows(numRows, numColumns);

                // Regenerate possibleSlotColorsDataStrings
                state.hints.possibleSlotColorsDataStrings =  Array(numColumns)
                    .fill(gamePaletteDataString);

                // Regenerate colorsMinMax
                state.hints.colorsMinMax = Array(numColors)
                    .fill([...[0, maxIdenticalColorsInSolution]]);

                // Regenerate solution
                const solutionColors = generateSolution(state);
                state.game.solutionColorsDataString = Colors.serialize(solutionColors);

                // Prefill rows
                for (let i = 1; i <= numPrefilledRows; i++) {
                    state.game.gameRows[i].rowColorsDataString = Colors.serialize(generateRandomGuess(state));
                    setTimeout(() => get().guess(), 1);
                }

            }, false, 'changeSettings');
        },
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
        reset: () => {
            // const { generateSolution } = get();
            set((state: gameState & gameActions) => {
                const { numRows, numColors, numColumns, maxIdenticalColorsInSolution } = state.settings;

                // reset game state
                state.game.gameState = gameStates[0];
                state.game.activeRowIndex = 1;
                state.game.timerSeconds = 0;

                // reset all game rows
                state.game.gameRows = initializeGameRows(numRows, numColumns);

                // reset hints
                const blankHints = {
                    colorsMinMax: Array(numColors).fill([...[0, maxIdenticalColorsInSolution]]),
                    possibleSlotColorsDataStrings: Array(numColumns)
                    .fill(state.game.paletteColorsDataString),
                    disabledColorsDataString: '[]',
                }
                state.hints = blankHints;
                state.hints.colorsMinMax = blankHints.colorsMinMax;

                // generateSolution;
                state.game.solutionColorsDataString = Colors.serialize(generateSolution(state));

                // Prefill rows
                for (let i = 1; i <= state.settings.numPrefilledRows; i++) {
                    state.game.gameRows[i].rowColorsDataString = Colors.serialize(generateRandomGuess(state));
                    setTimeout(() => get().guess(), 1);
                }
            }, false, 'reset')
        },
        randomGuess: () => {
            const state = get();
            // Generate random guess
            const randomGuess = generateRandomGuess(state);
            // Place random guess in the currely active game row
            set((state: gameState) => {
                state.game.gameRows[state.game.activeRowIndex].rowColorsDataString = Colors.serialize(randomGuess);
            }, false, 'randomGuess')
        },
        guess: () => {
            const state = get();
            const gamePalette = Colors.deserialize(state.game.paletteColorsDataString);
            let solutionColors = Colors.deserialize(state.game.solutionColorsDataString);
            const rowIndex = state.game.activeRowIndex;
            const { numColumns } = state.settings;
            let { solutionColorsDataString } = state.game;
            const currentRowColors = Colors.deserialize(state.game.gameRows[rowIndex].rowColorsDataString);

            // Generate solution colors on the fly, if they haven't been set, yet
            if (solutionColorsDataString === defaultRowColorsDataString(numColumns)) {
                solutionColors = generateSolution(state);
                solutionColorsDataString = Colors.serialize(solutionColors);
            }

            // Compute number of fully correct pins
            let _numFullyCorrect = 0;
            currentRowColors.forEach((color, index) => {
                if (color.hasSameHue(solutionColors[index])) _numFullyCorrect++;
            })
            
            // Compute number of correct colors
            // For each hue collect the number that it appears in the currentRowColors Array
            const rowHueCounts = Object.fromEntries(gamePalette.map(color => [color.hue,0]));
            currentRowColors.forEach(color => {
                rowHueCounts[color.hue]++;
            })

            // For each hue collect the number that it appears in the solutionColors Array
            const solutionHueCounts = Object.fromEntries(gamePalette.map(color => [color.hue,0]));
            solutionColors.forEach(solutionColor => {
                solutionHueCounts[solutionColor.hue]++;
            })

            // Always take the minimum of both numbers
            const correctHueCounts = Object.fromEntries(gamePalette.map(color => [color.hue,0]));
            gamePalette.forEach(baseColor => {
                correctHueCounts[baseColor.hue] = Math.min(rowHueCounts[baseColor.hue], solutionHueCounts[baseColor.hue]);
            })

            // Add upp the number of correctly guess colors
            const _numCorrectColor = Object.values(correctHueCounts).reduce((acc, next) => acc+next, 0);

            // Compute new game state and activeRowIndex
            let newGameState = state.game.gameState;
            let newActiveRowIndex = state.game.activeRowIndex + 1;

            // Start game once submitting the first row
            if (state.game.activeRowIndex === 1) newGameState = gameStates[1];

            // Check for victory condition
            if (_numFullyCorrect === state.settings.numColumns) {
                newGameState = gameStates[2];
                newActiveRowIndex = -1;
                // Check for running out of rows -> loss
            } else if (state.game.activeRowIndex === state.settings.numRows) {
                newGameState = gameStates[3];
                newActiveRowIndex = -1;
            }
            
            set((state: gameState) => {
                // Update row state
                state.game.gameRows[rowIndex].numFullyCorrect = _numFullyCorrect;
                state.game.gameRows[rowIndex].numCorrectColor = _numCorrectColor;

                // Update game state
                state.game.gameState = newGameState;
                state.game.activeRowIndex = newActiveRowIndex;
                state.game.solutionColorsDataString = solutionColorsDataString;
            }, false, 'guess')
        },
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
                state.hints.possibleSlotColorsDataStrings[columnIndex] = Colors.serialize(colors);
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
        setModal: (modal: modal) => {
            set((state: gameState) => {
                state.modal = modal;
            }, false, 'setModal')
        },
    })))
);

export default useGameStore;