import { gameStates } from "../../constants";
import { zustandGetter, zustandSetter } from "../../interfaces/types";
import Colors from "../../util/Colors";
import generateSolution from "../functions/generateSolution";
import { defaultRowColorsDataString, gameState } from "../gameStore";

const guess = (set: zustandSetter, get: zustandGetter) => () => {
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
}

export default guess;