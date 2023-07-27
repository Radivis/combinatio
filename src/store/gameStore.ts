import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { modal } from '../interfaces/interfaces';
import {
    gameStates,
    holeHue,
    holeLightness,
    holeSaturation,
} from '../constants';
import Colors from '../util/Colors';
import Color from '../util/Color';
import { gameState, gameStore } from '../interfaces/types';
// HELPER FUNCTIONS
import generateRandomGuess from './functions/generateRandomGuess';
// ACTIONS
import changeGameSettings from './actions/changeGameSettings';
import reset from './actions/reset';
import guess from './actions/guess';
import toggleDisableColor from './actions/toggleDisableColor';
import setPossibleColors from './actions/setPossibleColors';
import setColorMinMax from './actions/setColorMinMax';
import resetHints from './actions/resetHints';

import initialGameState from './initialGameState';
import generateDefaultRowColorsDataString from './functions/generateDefaultRowColorsDataString';
import toggleDisableIcon from './actions/toggleDisableIcon';



// Doesn't seem to work!
// const executeAction = (get: () => gameActions, action: keyof gameActions, params?: any[]) => {
//     setTimeout(() => get()[action], 1);
// }


const useGameStore = create<gameStore>()(
    devtools(immer((set, get) => ({
        displaySettings: initialGameState.displaySettings,
        gameSettings: initialGameState.gameSettings,
        game: initialGameState.game,
        hints: initialGameState.hints,
        modal: initialGameState.modal,
        changeGameSettings: changeGameSettings(set, get),
        setAreColorAmountHintsActive: (value: boolean) => {
            set((state: gameState) => {
                state.displaySettings.areColorAmountHintsActive = value;
            }, false, 'setAreColorAmountHintsActive')
        },
        setAreSlotHintsActive: (value: boolean) => {
            set((state: gameState) => {
                state.displaySettings.areSlotHintsActive = value;
            }, false, 'setAreSlotHintsActive')
        },
        setAreCombinationNotesActive: (value: boolean) => {
            set((state: gameState) => {
                state.displaySettings.areCombinationNotesActive = value;
            }, false, 'setAreCombinationNotesActive')
        },
        setIsRandomGuessButtonDisplayed: (value: boolean) => {
            set((state: gameState) => {
                state.displaySettings.isRandomGuessButtonDisplayed = value;
            }, false, 'setIsRandomGuessButtonDisplayed')
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
        toggleDisableColor: toggleDisableColor(set, get),
        toggleDisableIcon: toggleDisableIcon(set, get),
        setPossibleColors: setPossibleColors(set, get),
        resetHints: resetHints(set, get),
        setColorMinMax: setColorMinMax(set, get),
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
                .push([generateDefaultRowColorsDataString(2),'']);
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