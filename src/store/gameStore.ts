import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { game, gameRow, settings } from '../interfaces/interfaces';
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
    game: game
}

type gameActions = {
    changeSettings: (newSettings: settings) => void,
    setSolution: (solutionColors: Colors) => void,
    placeColor: ({color, row, column}: {color: Color, row: number, column: number}) => void,
    start: () => void,
    win: () => void,
    lose: () => void,
    reset: () => void,
    guess: () => void,
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
    }
}

const useGameStore = create<gameState & gameActions>()(
    devtools(immer((set, get) => ({
        settings: initialGameState.settings,
        game: initialGameState.game,
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
            });
        },
        setSolution: (solutionColors: Colors) => {
            set((state: gameState) => {
                state.game.solutionColorsDataString = Colors.serialize(solutionColors);
            });
        },
        placeColor: ({color, row, column}: {color: Color, row: number, column: number}) => {
            const rowColors: Colors = Colors.deserialize(get().game.gameRows[row].rowColorsDataString);
            rowColors[column] = color;
            set((state: gameState) => {
                state.game.gameRows[row].rowColorsDataString = Colors.serialize(rowColors);
            });
        },
        start: () => {
            set((state: gameState) => {
                state.game.gameState = gameStates[1];
            })
        },
        win: () => {
            set((state: gameState) => {
                state.game.gameState = gameStates[2];
                state.game.activeRowIndex = -1;
            })
        },
        lose: () => {
            set((state: gameState) => {
                state.game.gameState = gameStates[3];
                state.game.activeRowIndex = -1;
            })
        },
        reset: () => {
            set((state: gameState) => {
                state.game.gameState = gameStates[0];
                state.game.activeRowIndex = 1;
                state.game.timerSeconds = 0;
            })
        },
        guess: () => {
            const state = get();
            const gamePalette = Colors.deserialize(state.game.paletteColorsDataString);
            const solutionColors = Colors.deserialize(state.game.solutionColorsDataString);
            const rowIndex = state.game.activeRowIndex;
            const currentRowColors = Colors.deserialize(state.game.gameRows[rowIndex].rowColorsDataString);

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
            let newActiveRowIndex = state.game.activeRowIndex+1;

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
            })
        },
    })))
);

export default useGameStore;