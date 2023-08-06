
import generateDefaultRowColorsDataString from "../functions/generateDefaultRowColorsDataString";
import initializeGameRows from "../functions/initializeGameRows";
import Colors from "../../util/Colors";
import { gameSettings } from "../../interfaces/interfaces";
import generatePalette from "../functions/generatePalette";
import { gameStates } from "../../constants";
import generateSolutionColors from "../functions/generateSolutionColors";
import generateRandomColorGuess from "../functions/generateRandomColorGuess";
import { zustandGetter, zustandSetter } from "../../interfaces/types";
import { gameState, gameActions } from "../../interfaces/types";
import { pieceTypes } from "../../constants";
import pickIconCollection from "../functions/pickIconCollection";
import generateSolutionIcons from "../functions/generateSolutionIcons";
import generateRandomIconGuess from "../functions/generateRandomIconGuess";

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
            maxIdenticalIconsInSolution,
            numColumns,
            numPrefilledRows,
            numColors,
            numIcons,
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
        if (pieceType === pieceTypes.colorIcon) {
            const iconCollectionNames = pickIconCollection(numIcons);
            state.game.iconCollectionNames = iconCollectionNames;

            // (Re)generate possibleIconNames
            state.hints.possibleSlotIconNames = Array(numColumns)
            .fill(iconCollectionNames);
        }
        state.game.gameRows = initializeGameRows(numRows, numColumns);

        // Regenerate possibleSlotColorsDataStrings
        state.hints.possibleSlotColorsDataStrings =  Array(numColumns)
            .fill(gamePaletteDataString);



        // Regenerate colorsMinMax
        state.hints.colorsMinMax = Array(numColors)
            .fill([...[0, maxIdenticalColorsInSolution]]);

        // Regenerate iconsMinMax
        state.hints.iconsMinMax = Array(numIcons)
        .fill([...[0, maxIdenticalIconsInSolution]]);

        // Reset disabled colors and icons
        state.hints.disabledColorsDataString = '[]';
        state.hints.disabledIcons = [];

        // Reset colorTuples
        state.hints.combinationNotes = Array(2).fill([generateDefaultRowColorsDataString(2), '']);

        // Regenerate solution
        const solutionColors = generateSolutionColors(state);
        state.game.solutionColorsDataString = Colors.serialize(solutionColors);
        if (pieceType === pieceTypes.colorIcon) {
            state.game.solutionIconNames = generateSolutionIcons(state);
        }

        // Prefill rows
        for (let i = 1; i <= numPrefilledRows; i++) {
            state.game.gameRows[i].rowColorsDataString = Colors.serialize(generateRandomColorGuess(state));
            if (pieceType === pieceTypes.colorIcon) {
                state.game.gameRows[i].rowIconNames = generateRandomIconGuess(state);
            }
            setTimeout(() => get().guess(), 1);
        }

    }, false, 'changeGameSettings');
}

export default changeGameSettings;