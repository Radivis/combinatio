import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { modal } from '../interfaces/interfaces';
import {
    emptyCombinationNote,
    gameStates,
    holeHue,
    holeLightness,
    holeSaturation,
    pieceTypes,
} from '../constants';
import Colors from '../util/Colors';
import Color from '../util/Color';
import ColorIcons from '../util/ColorIcons';
import ColorIcon from '../util/ColorIcon';
import { gameState, gameStore } from '../interfaces/types';
// HELPER FUNCTIONS
import generateRandomColorGuess from './functions/generateRandomColorGuess';
import generateRandomIconGuess from './functions/generateRandomIconGuess';
// ACTIONS
import changeGameSettings from './actions/changeGameSettings';
import reset from './actions/reset';
import guess from './actions/guess';
import toggleDisableColor from './actions/toggleDisableColor';
import setPossibleColors from './actions/setPossibleColors';
import setColorMinMax from './actions/setColorMinMax';
import setIconMinMax from './actions/setIconMinMax';
import resetHints from './actions/resetHints';

import initialGameState from './initialGameState';
import toggleDisableIcon from './actions/toggleDisableIcon';
import setPossibleIcons from './actions/setPossibleIcons';
import generateDefaultRowColorsDataString from './functions/generateDefaultRowColorsDataString';



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
        setAreIconAmountHintsActive: (value: boolean) => {
            set((state: gameState) => {
                state.displaySettings.areIconAmountHintsActive = value;
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
        setAreTranspositionsActive: (value: boolean) => {
            set((state: gameState) => {
                state.displaySettings.areTranspositionsActive = value;
            }, false, 'setAreTranspositionsActive')
        },
        setChangeMaxOccurrencesOnChangingMinOccurrences: (value: boolean) => {
            set((state: gameState) => {
                state.displaySettings.changeMaxOccurrencesOnChangingMinOccurrences = value;
            }, false, 'setChangeMaxOccurrencesOnChangingMinOccurrences')
        },
        setIsLegendDisplayed: (value: boolean) => {
            set((state: gameState) => {
                state.displaySettings.isLegendDisplayed = value;
            }, false, 'setIsLegendDisplayed')
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
        placeIcon: ({iconName, row, column}: {iconName: string, row: number, column: number}) => {
            set((state: gameState) => {
                state.game.gameRows[row].rowIconNames[column] = iconName;
            }, false, 'placeIcon');
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
            const { numColumns, pieceType } = state.gameSettings;
            let randomColorGuess: Colors = Colors.deserialize(generateDefaultRowColorsDataString(numColumns));
            let randomIconGuess: string[] = Array(numColumns).fill('');
            if (pieceType === pieceTypes.color || pieceType === pieceTypes.colorIcon) {
                // Generate random color guess
                randomColorGuess = generateRandomColorGuess(state);
            }
            if (pieceType === pieceTypes.icon || pieceType === pieceTypes.colorIcon) {
                // Generate random icon guess
                randomIconGuess = generateRandomIconGuess(state);
            }
            // Place random guess in the currely active game row
            set((state: gameState) => {
                state.game.gameRows[state.game.activeRowIndex].rowColorsDataString = Colors.serialize(randomColorGuess);
                state.game.gameRows[state.game.activeRowIndex].rowIconNames = randomIconGuess;
            }, false, 'randomGuess')
        },
        guess: guess(set, get),
        toggleDisableColor: toggleDisableColor(set, get),
        toggleDisableIcon: toggleDisableIcon(set, get),
        setPossibleColors: setPossibleColors(set, get),
        setPossibleIcons: setPossibleIcons(set, get),
        resetHints: resetHints(set, get),
        setColorMinMax: setColorMinMax(set, get),
        setIconMinMax: setIconMinMax(set, get),
        placeTupleColor: ({color, rowIndex, columnIndex}: {color: Color, rowIndex: number, columnIndex: number}) => {
            const { combinationNotes } = get().hints;
            const colorTuple = (ColorIcons.deserialize(combinationNotes[rowIndex][0])).colors;
            const iconNamesTuple = (ColorIcons.deserialize(combinationNotes[rowIndex][0])).iconNames;
            colorTuple[columnIndex] = color;
            const colorIconsTuple = ColorIcons.fuse(colorTuple, iconNamesTuple);
            set((state: gameState) => {
                state.hints.combinationNotes[rowIndex][0] = ColorIcons.serialize(colorIconsTuple);
            }, false, 'placeTupleColor');
        },
        placeTupleIcon: ({iconName, rowIndex, columnIndex}: {iconName: string, rowIndex: number, columnIndex: number}) => {
            const { combinationNotes } = get().hints;
            const colorTuple = (ColorIcons.deserialize(combinationNotes[rowIndex][0])).colors;
            const iconNamesTuple = (ColorIcons.deserialize(combinationNotes[rowIndex][0])).iconNames;
            iconNamesTuple[columnIndex] = iconName;
            const colorIconsTuple = ColorIcons.fuse(colorTuple, iconNamesTuple);
            set((state: gameState) => {
                state.hints.combinationNotes[rowIndex][0] = ColorIcons.serialize(colorIconsTuple);
            }, false, 'placeTupleIcon');
        },
        addColorTuple: () => {
            set((state: gameState) => {
                state.hints.combinationNotes
                .push([...emptyCombinationNote]);
            }, false, 'addColorTuple')
        },
        addColorTupleSlot: (rowIndex: number) => {
            set((state: gameState) => {
                const colorIconTuple = ColorIcons.deserialize(state.hints.combinationNotes[rowIndex][0]);
                colorIconTuple.push(new ColorIcon(holeHue, holeSaturation, holeLightness, ''));
                state.hints.combinationNotes[rowIndex][0] = ColorIcons.serialize(colorIconTuple);
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