import { emptyCombinationNote, gameStates, pieceTypes } from "../../constants";
import { zustandGetter, zustandSetter } from "../../interfaces/types";
import Colors from "../../util/Colors";
import generateRandomColorGuess from "../functions/generateRandomColorGuess";
import generateSolutionColors from "../functions/generateSolutionColors";
import generateDefaultRowColorsDataString from "../functions/generateDefaultRowColorsDataString";
import initializeGameRows from "../functions/initializeGameRows";
import { gameState, gameActions } from "../../interfaces/types";
import generateSolutionIcons from "../functions/generateSolutionIcons";
import generateRandomIconGuess from "../functions/generateRandomIconGuess";

const reset = (set: zustandSetter, get: zustandGetter) => (): void => {
    // const { generateSolution } = get();
    set((state: gameState & gameActions) => {
        const {
            numRows,
            numColors,
            numIcons,
            numColumns,
            maxIdenticalColorsInSolution,
            maxIdenticalIconsInSolution,
            pieceType
        } = state.gameSettings;

        // reset game state
        state.game.gameState = gameStates[0];
        state.game.activeRowIndex = 1;
        state.game.timerSeconds = 0;

        // reset all game rows
        state.game.gameRows = initializeGameRows(numRows, numColumns);

        // reset hints
        const blankHints = {
            colorsMinMax: Array(numColors).fill([...[0, maxIdenticalColorsInSolution]]),
            iconsMinMax: Array(numIcons).fill([...[0, maxIdenticalIconsInSolution]]),
            possibleSlotColorsDataStrings: Array(numColumns)
            .fill(state.game.paletteColorsDataString),
            possibleSlotIconNames: Array(numColumns)
            .fill(state.game.iconCollectionNames),
            disabledColorsDataString: '[]',
            combinationNotes: Array(2).fill([...emptyCombinationNote]),
            disabledIcons: [],
        }
        state.hints = blankHints;
        state.hints.colorsMinMax = blankHints.colorsMinMax;

        // generateSolution;
        state.game.solutionColorsDataString = Colors.serialize(generateSolutionColors(state));
        if (pieceType === pieceTypes.colorIcon) {
            state.game.solutionIconNames = generateSolutionIcons(state);
        }

        // Prefill rows
        for (let i = 1; i <= state.gameSettings.numPrefilledRows; i++) {
            state.game.gameRows[i].rowColorsDataString = Colors.serialize(generateRandomColorGuess(state));
            if (pieceType === pieceTypes.colorIcon) {
                state.game.gameRows[i].rowIconNames = generateRandomIconGuess(state);
            }
            setTimeout(() => get().guess(), 1);
        }
    }, false, 'reset')
}

export default reset;