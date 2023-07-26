
import generateDefaultRowColorsDataString from "../functions/generateDefaultRowColorsDataString";
import initializeGameRows from "../functions/initializeGameRows";
import Colors from "../../util/Colors";
import { gameSettings } from "../../interfaces/interfaces";
import generatePalette from "../functions/generatePalette";
import { gameStates } from "../../constants";
import generateSolution from "../functions/generateSolution";
import generateRandomGuess from "../functions/generateRandomGuess";
import { zustandGetter, zustandSetter } from "../../interfaces/types";
import { gameState, gameActions } from "../../interfaces/types";

const changeGameSettings = (set: zustandSetter, get: zustandGetter) => (newSettings: gameSettings): void => {
    const oldState = get();

    // Generate new colors palette, if necessary
    let gamePaletteDataString = oldState.game.paletteColorsDataString;
    if (oldState.gameSettings.numColors !== newSettings.numColors
    || oldState.gameSettings.paletteName !== newSettings.paletteName) {
        gamePaletteDataString = Colors.serialize(generatePalette(newSettings.numColors, newSettings.paletteName));
    }
    
    set((state: gameState & gameActions) => {
        const {
            maxIdenticalColorsInSolution,
            numColumns,
            numPrefilledRows,
            numColors,
            numRows,
            pieceType,
        } = newSettings;

        state.gameSettings = newSettings;
        
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

        // Reset disabled colors
        state.hints.disabledColorsDataString = '[]';

        // Reset colorTuples
        state.hints.combinationNotes = Array(2).fill([generateDefaultRowColorsDataString(2), '']);

        // Regenerate solution
        const solutionColors = generateSolution(state);
        state.game.solutionColorsDataString = Colors.serialize(solutionColors);

        // Prefill rows
        for (let i = 1; i <= numPrefilledRows; i++) {
            state.game.gameRows[i].rowColorsDataString = Colors.serialize(generateRandomGuess(state));
            setTimeout(() => get().guess(), 1);
        }

    }, false, 'changeGameSettings');
}

export default changeGameSettings;