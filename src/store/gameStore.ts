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
import { colorsDataString } from '../interfaces/types';
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
    randomGuess: () => void,
    guess: () => void,
    resetHints: () => void,
    toggleDisableColor: (color: Color) => void,
    setPossibleColors: (colors: Colors, columnIndex: number) => void,
    setColorMinMax: ({colorIndex, min, max}: {colorIndex: number, min?: number, max?: number}) => void,
}

// Doesn't seem to work!
// const executeAction = (get: () => gameActions, action: keyof gameActions, params?: any[]) => {
//     setTimeout(() => get()[action], 1);
// }

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
        numPrefilledRows: 0,
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

/**
 * Generates a solution for the current game
 * 
 * @param {gameState} state - The current state of the game
 * @returns {Colors} - the new solution as Colors instance
 */
const generateSolution = (state: gameState): Colors => {
    const { maxIdenticalColorsInSolution, numColumns } = state.settings;
    const { paletteColorsDataString } = state.game;
    const paletteColors: Colors = Colors.deserialize(paletteColorsDataString);
    const solutionColors: Color[] = [];
    // Implicit assumption: All colors have different hues!

    // Create an array of pairs that counts the number of remaining legal occurences of each color
    const colorHueCountPairs = paletteColors
        .map((color: Color) => [color.hue, maxIdenticalColorsInSolution]);

    let slotsLeft = numColumns;
    while (slotsLeft > 0) {
        // Check whether a solution can be generated at all given the circumstances
        if (colorHueCountPairs.length === 0) {
            // Generate informative error message
            let message = 'Cannot generate solution due to insufficient possible colors!';
            message += `\nNumber of slots: ${numColumns}`;
            message += `\nNumber of colors: ${paletteColors.length}`;
            message += `\nMax number of identical colors in solution: ${maxIdenticalColorsInSolution}`;
            message += `\nArithmetic constraint: `
            message += `${paletteColors.length} * ${maxIdenticalColorsInSolution} >= ${numColumns}`;
            message += ` is ${paletteColors.length * maxIdenticalColorsInSolution >= numColumns}`;
            throw new Error(message);
        }

        // Pick a random color from the array, by picking a random index
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

/**
 * Generates a random guess for the currently active game row
 * 
 * @param {gameState} state - The current state of the game
 * @returns {Colors} - the new random guess as Colors instance
 */
const generateRandomGuess = (state: gameState): Colors => {
    const { numColumns } = state.settings;
    const { paletteColorsDataString } = state.game;
    const paletteColors: Colors = Colors.deserialize(paletteColorsDataString);
    const {
        colorsMinMax,
        possibleSlotColorsDataStrings
    } = state.hints;
    // Start with a color array with all slots undefined
    const guessColors: (Color | undefined)[] = Array(numColumns).fill(undefined);
    // Implicit assumption: All colors have different hues!

    const colorMaxPairs: [Color, number][] = paletteColors.map((color, colorIndex) => {
        const colorMax = colorsMinMax[colorIndex][1];
        return [color, colorMax];
    })

    // Step 1: Fill all "certain" slots
    for (let slotIndex = 0; slotIndex < numColumns; slotIndex++) {
        const possibleSlotColors = Colors.deserialize(possibleSlotColorsDataStrings[slotIndex]);
        if (possibleSlotColors.length === 1) {
            // if there is only one possible color, select that for this slot!
            const colorToPlace = possibleSlotColors[0];
            guessColors[slotIndex] = colorToPlace;

            // decrement fitting colorMaxPair
            colorMaxPairs.find((pair: [Color, number]) => pair[0].equals(colorToPlace))![1]--;
        }
    }

    // Step 2: Fill slots until the colorsMinMax min numbers are satisfied
    const colorMinPairs: [Color, number][] = paletteColors.map((color, colorIndex) => {
        const colorMin = colorsMinMax[colorIndex][0];
        return [color, colorMin];
    })

    // Check whether necessary colors have already been placed in step 1
    colorMinPairs.forEach((colorMinPair: [Color, number]) => {
        if (colorMinPair[1] > 0) {
            // Check each slot, whether the color already has been placed there
            guessColors.forEach((color, slotIndex) => {
                if (color !== undefined && colorMinPair[0].equals(color)) {
                    // decrement colorMax
                    colorMinPair[1]--;
                }
            })
        }
    })

    // Fill random slots with necessary colors
    let numNecessaryColors = colorMinPairs.reduce((acc, colorMinPair) => colorMinPair[1] + acc, 0);
    
    // Get the indices of the slots yet to be filled
    let remainingSlotIndices: number[] = [];
    guessColors.forEach((color, index) => {
        if (color === undefined) remainingSlotIndices.push(index);
    })

    // Throw an error, if the number of necessary colors exceeds the number of columns!
    if (numNecessaryColors > remainingSlotIndices.length) {
        throw new Error(`Cannot place more colors than there are free slots! Check your min numbers!`)
    }

    while (numNecessaryColors > 0) {
        // Pick necessary color
        const necessaryColorPair = colorMinPairs.find((colorPair) => colorPair[1] > 0)!;

        let isColorPlaced = false;
        let metaIndex = 0;
        while (!isColorPlaced && remainingSlotIndices.length > 0) {
            // Select slot, in which the color is possible to add that color in
            let remainingSlotIndex = remainingSlotIndices[metaIndex];

            if (Colors.deserialize(possibleSlotColorsDataStrings[remainingSlotIndex])
                .has(necessaryColorPair[0])) {
                // color is possible in this slot, add it!
                const colorToPlace = necessaryColorPair[0];
                
                guessColors[remainingSlotIndex] = colorToPlace;

                // decrement min of the selected Color-min-pair
                let isDecremented = false;
                let pairIndex = 0;
                while (!isDecremented) {
                    const colorMinPair = colorMinPairs[pairIndex];
                    if (colorMinPair[0].equals(colorToPlace)){
                        colorMinPair[1]--;
                        isDecremented = true;
                    } else {
                        pairIndex++;
                    }
                }

                // decrement numNecessaryColors
                numNecessaryColors--;

                // decrement fitting colorMaxPair
                colorMaxPairs.find((pair: [Color, number]) => pair[0].equals(colorToPlace))![1]--;

                // flag the selected color as placed
                isColorPlaced = true;

                // remove slot from the remainingSlotIndices array
                remainingSlotIndices.splice(metaIndex, 1);
            } else {
                // Color could not be placed, because it is not possible in that slot,
                // go to the next remainingSlotIndex
                metaIndex++;

                // Check if the loop can still terminate, otherwise throw Error
                if (metaIndex > remainingSlotIndices.length - 1) {
                    throw new Error("Cannot complete random guess, because no slot for a necessary color can be found!");
                }
            }
        }
        if (numNecessaryColors > remainingSlotIndices.length) {
            // Necessary colors could not be placed!
            throw new Error("Cannot complete random guess, because there are no available slots left for the necessary colors! Check your min numbers!");
        }
    }

    // Step 3: Fill the remaining slots randomly, respecting the colorsMinMax max numbers
    while (remainingSlotIndices.length > 0) {
        // Select the first remaining slot
        const remainingSlotIndex = remainingSlotIndices[0];

        // fill it with a random color that can still be placed
        let isColorPlaced = false;
        while (!isColorPlaced) {
            const possibleSlotColors = Colors.deserialize(possibleSlotColorsDataStrings[remainingSlotIndex]);
            
            // eslint-disable-next-line no-loop-func
            possibleSlotColors.forEach(color => {
                if (!isColorPlaced) {
                    // Check which the colors can still be placed
                    const possibleColorMaxPairs = colorMaxPairs.filter((pair: [Color, number]) => {
                        if (pair[1] > 0) return true;
                        return false;
                    })

                    if (possibleColorMaxPairs.length === 0) {
                        throw new Error(`Cannot fill slot with index ${remainingSlotIndex}, because no remaining color could be found`);
                    }

                    // Select a random index to get a random possible color
                    const randomIndex = Math.floor(Math.random() * possibleColorMaxPairs.length);

                    const colorToPlace = possibleColorMaxPairs[randomIndex][0];

                    // Place the color in the remaining slot
                    guessColors[remainingSlotIndex] = colorToPlace;

                    // decrement fitting colorMaxPair
                    colorMaxPairs.find((pair: [Color, number]) => pair[0].equals(colorToPlace))![1]--;

                    // flag the selected color as placed
                    isColorPlaced = true;

                    // remove slot from the remainingSlotIndices array
                    const metaIndex = remainingSlotIndices.indexOf(remainingSlotIndex);
                    remainingSlotIndices.splice(metaIndex, 1);
                }
            })
        }
    }

    let areAllGuessColorsDefined = true;
    guessColors.forEach((color) => {
        if (color === undefined) areAllGuessColorsDefined = false;
    })

    if (!areAllGuessColorsDefined) throw new Error("Couldn't complete random guess");

    return new Colors(guessColors as Color[]);
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
    })))
);

export default useGameStore;