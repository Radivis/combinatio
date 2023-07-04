import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { game, gameRow, hints, settings } from '../interfaces/interfaces';
import {
    defaultNumColors,
    defaultNumColumns,
    defaultNumRows,
    defaultBaseSaturation,
    defaultBaseLightness,
    gameStates,
    holeHue,
    holeLightness,
    holeSaturation,
    paletteNames
} from '../constants';
import Colors from '../util/Colors';
import Color from '../util/Color';
import { colorDataString, colorsDataString } from '../interfaces/types';
import { range } from '../util/range';

type gameState = {
    settings: settings,
    game: game,
    hints: hints
}

type gameActions = {
    changeSettings: (newSettings: settings) => void,
    placeColor: ({color, row, column}: {color: Color, row: number, column: number}) => void,
    start: () => void,
    win: () => void,
    lose: () => void,
    reset: () => void,
    guess: () => void,
    resetHints: () => void,
    toggleDisableColor: (color: Color) => void,
    setPossibleColors: (colors: Colors, columnIndex: number) => void,
    setColorMinMax: ({colorIndex, min, max}: {colorIndex: number, min?: number, max?: number}) => void,
}

const defaultRowColorsDataString = (numColumns: number): colorsDataString => Colors.serialize(new Colors(
    {
        color: new Color(holeHue, holeSaturation, holeLightness),
        length: numColumns
    }
));

const generateRegularPalette = (numColors: number): Colors => {
    return new Colors([...Array(numColors).keys()].map(i => {
		return Color.makeHsl(i * 360/numColors, defaultBaseSaturation, defaultBaseLightness);
    }))
};

const zanthiaPalette: Colors = new Colors([
    Color.makeHsl(204, 72, 53),
    Color.makeHsl(52, 94, 51),
    Color.makeHsl(131, 74, 38),
    Color.makeHsl(343, 88, 41),
    Color.makeHsl(264, 67, 63),
    Color.makeHsl(32, 59, 48)
]);

const generatePalette = (numberColors: number, paletteName: string): Colors => {
    switch (paletteName) {
        case paletteNames[1]:
            return zanthiaPalette;
        default:
            return generateRegularPalette(numberColors);
    }
 }

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
		maxIdenticalColorsInSolution: defaultNumColumns,
		paletteName: paletteNames[0],
		areColorAmountHintsActive: true,
		areSlotHintsActive: true,
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
    }
}

const generateSolution = (state: gameState): Colors => {
    const { maxIdenticalColorsInSolution, numColumns } = state.settings;
    const { paletteColorsDataString } = state.game;
    const paletteColors: Colors = Colors.deserialize(paletteColorsDataString);
    const solutionColors: Color[] = [];
    // Implicit assumption: All colors have different hues!
    const colorHueCountPairs = paletteColors
        .map((color: Color) => [color.hue, maxIdenticalColorsInSolution]);
    let slotsLeft = numColumns;
    while (slotsLeft > 0) {
        const randomColorHueCountPair = colorHueCountPairs[~~(Math.random()*(colorHueCountPairs.length))];
        // Decrement the count of the chosen color
        randomColorHueCountPair[1] -= 1;
        // If the count has reached zero, remove the pair from the array
        if (randomColorHueCountPair[1] === 0) {
            const pairIndex = colorHueCountPairs.indexOf(randomColorHueCountPair);
            colorHueCountPairs.splice(pairIndex, 1);
        }
        // Add the chosen color to the solution and decrement the slot counter
        const solutionColor = paletteColors.find((color: Color) => color.hue === randomColorHueCountPair[0]);
        if (solutionColor !== undefined) {
            solutionColors.push(solutionColor);
            slotsLeft--;
        }
    }
    return new Colors(solutionColors);
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
        changeSettings: (newSettings: settings): void => {
            const oldState = get();

            // Generate new colors palette, if necessary
            let gamePaletteDataString = oldState.game.paletteColorsDataString;
            if (oldState.settings.numColors !== newSettings.numColors
            || oldState.settings.paletteName !== newSettings.paletteName) {
                gamePaletteDataString = Colors.serialize(generatePalette(newSettings.numColors, newSettings.paletteName));
            }

            set((state: gameState) => {
                state.settings = newSettings;
                state.game.paletteColorsDataString = gamePaletteDataString;
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
            set((state: gameState) => {
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
            }, false, 'reset')
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

            // console.log("guessing solution: " + state.game.solutionColorsDataString);
            // console.log("guess: " + state.game.gameRows[rowIndex].rowColorsDataString);

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
            }

            // Check for running out of rows -> loss
            if (state.game.activeRowIndex === state.settings.numRows) {
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
                        
                    }
                }
            }, false, 'setColorMinMax');
        },
    })))
);

export default useGameStore;