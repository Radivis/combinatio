
import { gameState, gameActions, defaultRowColorsDataString, initializeGameRows } from "../gameStore";
import Colors from "../../util/Colors";
import { settings } from "../../interfaces/interfaces";
import generatePalette from "../functions/generatePalette";
import { gameStates } from "../../constants";
import generateSolution from "../functions/generateSolution";
import generateRandomGuess from "../functions/generateRandomGuess";
import { zustandGetter, zustandSetter } from "../../interfaces/types";

const changeSettings = (set: zustandSetter, get: zustandGetter) => (newSettings: settings): void => {
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

        // Reset disabled colors
        state.hints.disabledColorsDataString = '[]';

        // Reset colorTuples
        state.hints.combinationNotes = Array(2).fill([defaultRowColorsDataString(2), '']);

        // Regenerate solution
        const solutionColors = generateSolution(state);
        state.game.solutionColorsDataString = Colors.serialize(solutionColors);

        // Prefill rows
        for (let i = 1; i <= numPrefilledRows; i++) {
            state.game.gameRows[i].rowColorsDataString = Colors.serialize(generateRandomGuess(state));
            setTimeout(() => get().guess(), 1);
        }

    }, false, 'changeSettings');
}

export default changeSettings;