import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { game, settings } from '../interfaces/interfaces';
import { defaultNumColors, defaultNumColumns, defaultNumRows, gameStates, holeHue, holeLightness, holeSaturation, paletteNames } from '../constants';
import Colors from '../util/Colors';
import Color from '../util/Color';

type gameState = {
    settings: settings,
    game: game
}

type gameActions = {
    changeSettings: (newSettings: settings) => void,
    start: () => void,
    win: () => void,
    lose: () => void,
    reset: () => void,
    guess: () => void,
}

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
        activeRowIndex: 1,
        solutionColorsDataString: Colors.serialize(new Colors(
            {
                color: new Color(holeHue, holeSaturation, holeLightness),
                length: defaultNumColors
            })),
        gameState: gameStates[0],
        timerSeconds: 0,
    }

}

const useGameStore = create<gameState & gameActions>()(
    devtools(immer((set, get) => ({
        settings: initialGameState.settings,
        game: initialGameState.game,
        changeSettings: (newSettings: settings): void => {
            set((state: gameState) => {
                state.settings = newSettings
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
            set((state: gameState) => {
                state.game.activeRowIndex = state.game.activeRowIndex+1;
            })
        },
    })))
);