import { gameState } from "../../interfaces/types";

/**
 * Generates solution icons for the current game
 * 
 * @param {gameState} state - The current state of the game
 * @returns {string[]} - the new (partial) solution as array of iconNames
 */
const generateSolutionIcons = (state: gameState): string[] => {
    const { maxIdenticalIconsInSolution, numColumns } = state.gameSettings;
    const { iconCollectionNames } = state.game;
    if(iconCollectionNames === undefined) {
        throw new Error(`Cannot generate solution icons, because the game has no icon collection, yet!`);
    }
    const solutionIconNames: string[] = [];

    // Create an array of pairs that counts the number of remaining legal occurences of each icon
    const iconNameCountPairs: [string, number][] = iconCollectionNames
        .map((iconName: string) => [iconName, maxIdenticalIconsInSolution]);

    let slotsLeft = numColumns;
    while (slotsLeft > 0) {
        // Check whether a solution can be generated at all given the circumstances
        if (iconNameCountPairs.length === 0) {
            // Generate informative error message
            let message = 'Cannot generate solution due to insufficient possible icons!';
            message += `\nNumber of slots: ${numColumns}`;
            message += `\nNumber of icons: ${iconCollectionNames.length}`;
            message += `\nMax number of identical icons in solution: ${maxIdenticalIconsInSolution}`;
            message += `\nArithmetic constraint: `
            message += `${iconCollectionNames.length} * ${maxIdenticalIconsInSolution} >= ${numColumns}`;
            message += ` is ${iconCollectionNames.length * maxIdenticalIconsInSolution >= numColumns}`;
            throw new Error(message);
        }

        // Pick a random iconName from the array, by picking a random index
        const randomIconNameCountPair = iconNameCountPairs[~~(Math.random()*(iconNameCountPairs.length))];
        // Decrement the count of the chosen iconName
        randomIconNameCountPair[1] -= 1;
        // If the count has reached zero, remove the pair from the array
        if (randomIconNameCountPair[1] === 0) {
            const pairIndex = iconNameCountPairs.indexOf(randomIconNameCountPair);
            iconNameCountPairs.splice(pairIndex, 1);
        }
        // Add the chosen iconName to the solution and decrement the slot counter
        const solutionIconName = iconCollectionNames.find((iconName: string) => iconName === randomIconNameCountPair[0]);
        if (solutionIconName !== undefined) {
            solutionIconNames.push(solutionIconName);
            slotsLeft--;
        }
    }
    return solutionIconNames;
}

export default generateSolutionIcons;