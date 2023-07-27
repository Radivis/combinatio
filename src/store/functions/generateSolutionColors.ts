import Color from "../../util/Color";
import Colors from "../../util/Colors";
import { gameState } from "../../interfaces/types";

/**
 * Generates solution colors for the current game
 * 
 * @param {gameState} state - The current state of the game
 * @returns {Colors} - the new solution colors as Colors instance
 */
const generateSolutionColors = (state: gameState): Colors => {
    const { maxIdenticalColorsInSolution, numColumns } = state.gameSettings;
    const { paletteColorsDataString } = state.game;
    const paletteColors: Colors = Colors.deserialize(paletteColorsDataString);
    const solutionColors: Color[] = [];
    // Implicit assumption: All colors have different hues!

    // Create an array of pairs that counts the number of remaining legal occurences of each color
    const colorHueCountPairs = paletteColors
        .map((color: Color) => [color.hue, maxIdenticalColorsInSolution]);

    let slotsLeft = numColumns;
    while (slotsLeft > 0) {
        // Check whether a solution can be generated at all given the circumstances
        if (colorHueCountPairs.length === 0) {
            // Generate informative error message
            let message = 'Cannot generate solution due to insufficient possible colors!';
            message += `\nNumber of slots: ${numColumns}`;
            message += `\nNumber of colors: ${paletteColors.length}`;
            message += `\nMax number of identical colors in solution: ${maxIdenticalColorsInSolution}`;
            message += `\nArithmetic constraint: `
            message += `${paletteColors.length} * ${maxIdenticalColorsInSolution} >= ${numColumns}`;
            message += ` is ${paletteColors.length * maxIdenticalColorsInSolution >= numColumns}`;
            throw new Error(message);
        }

        // Pick a random color from the array, by picking a random index
        const randomColorHueCountPair = colorHueCountPairs[~~(Math.random()*(colorHueCountPairs.length))];
        // Decrement the count of the chosen color
        randomColorHueCountPair[1] -= 1;
        // If the count has reached zero, remove the pair from the array
        if (randomColorHueCountPair[1] === 0) {
            const pairIndex = colorHueCountPairs.indexOf(randomColorHueCountPair);
            colorHueCountPairs.splice(pairIndex, 1);
        }
        // Add the chosen color to the solution and decrement the slot counter
        const solutionColor = paletteColors.find((color: Color) => color.hue === randomColorHueCountPair[0]);
        if (solutionColor !== undefined) {
            solutionColors.push(solutionColor);
            slotsLeft--;
        }
    }
    return new Colors(solutionColors);
}

export default generateSolutionColors;