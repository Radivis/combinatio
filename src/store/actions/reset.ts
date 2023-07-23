import { gameStates } from "../../constants";
import { zustandGetter, zustandSetter } from "../../interfaces/types";
import Colors from "../../util/Colors";
import generateRandomGuess from "../functions/generateRandomGuess";
import generateSolution from "../functions/generateSolution";
import { defaultRowColorsDataString, gameActions, gameState, initializeGameRows } from "../gameStore";

const reset = (set: zustandSetter, get: zustandGetter) => (): void => {
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
            combinationNotes: Array(2).fill([defaultRowColorsDataString(2), '']),
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
}

export default reset;