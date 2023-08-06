import Color from "../../util/Color";
import Colors from "../../util/Colors";
import { gameState, gameActions } from "../../interfaces/types";
import generateDefaultRowColorsDataString from "./generateDefaultRowColorsDataString";

const isDebugging = false;

const CYCLE_BOUND = 100;
const LOOP_BOUND = 100;

class CycleLimitError extends Error {

}

class LoopFailureError extends Error {

}

const checkCycles = (cycles: number): boolean => {
    if (cycles <= 0) throw new CycleLimitError('Oops, this action seems to have caused an enless loop!');
    return true;
};

/**
 * Generates a random guess for the currently active game row
 * 
 * @param {gameState} state - The current state of the game
 * @returns {string[]} - the new random guess as array of iconNames
 */
const generateRandomIconGuess = (state: gameState & gameActions, loops: number = LOOP_BOUND): string[] => {

    // Define allowed maxmium number of loop cycles to exit endless loops gracefully
    let cycles = CYCLE_BOUND;

    if (loops === 0) {
        throw new Error('Oops, this action seems to have caused an infinite loop');
    }

    const { setModal } = state;
    const { numColumns } = state.gameSettings;
    const { iconCollectionNames, activeRowIndex, gameRows } = state.game;
    const {
        iconsMinMax,
        possibleSlotIconNames
    } = state.hints;
    // Start with an iconName array with all slots undefined
    const guessIconNames: (string | undefined)[] = Array(numColumns).fill(undefined);

    const iconNameMaxPairs: [string, number][] = iconCollectionNames.map((iconName, iconIndex) => {
        const iconNameMax = iconsMinMax[iconIndex][1];
        return [iconName, iconNameMax];
    })

    try {

        // Step 1: Fill all "certain" slots
        for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
            const _possibleSlotIconNames = possibleSlotIconNames[columnIndex];

            if (_possibleSlotIconNames.length === 0) {
                throw new Error(`Cannot place random guess, because no icons are possible for slot number ${columnIndex}`);
            }

            if (_possibleSlotIconNames.length === 1) {
                // if there is only one possible icon, select that for this slot!
                const iconToPlace = _possibleSlotIconNames[0];
                guessIconNames[columnIndex] = iconToPlace;

                // decrement fitting iconNameMaxPair
                iconNameMaxPairs.find((pair: [string, number]) => pair[0] === iconToPlace)![1]--;
            }
        }

        // Step 2: Fill slots until the iconsMinMax min numbers are satisfied
        const iconNameMinPairs: [string, number][] = iconCollectionNames.map((iconName, iconIndex) => {
            const iconNameMin = iconsMinMax[iconIndex][0];
            return [iconName, iconNameMin];
        })

        // Check whether necessary icons have already been placed in step 1
        iconNameMinPairs.forEach((iconNameMinPair: [string, number]) => {
            if (iconNameMinPair[1] > 0) {
                // Check each slot, whether the icon already has been placed there
                guessIconNames.forEach((iconName, slotIndex) => {
                    if (iconName !== undefined && iconNameMinPair[0] === iconName) {
                        // decrement iconNameMax
                        iconNameMinPair[1]--;
                    }
                })
            }
        })

        // Fill random slots with necessary icons
        let numNecessaryIcons = iconNameMinPairs.reduce((acc, iconNameMinPair) => iconNameMinPair[1] + acc, 0);
        
        // Get the indices of the slots yet to be filled
        let remainingSlotIndices: number[] = [];
        guessIconNames.forEach((iconName, index) => {
            if (iconName === undefined) remainingSlotIndices.push(index);
        })

        // Throw an error, if the number of necessary icons exceeds the number of columns!
        if (numNecessaryIcons > remainingSlotIndices.length) {
            throw new Error(`Cannot place more icons than there are free slots! Check your min numbers!`)
        }

        /* Placing icons too randomly could result in an infinite loop,
        * first reduce the possible icons by minimizing the slot hint rows,
        * without actually eliminating them from the view
        * (the player doesn't need to know how smart this algorithm really is)
        */
        
        // Make a matrix of the rows of the icon hints
        const iconNameHintRows: (string | null)[][] = [];
        const numCertainIconNamesInHintRow: number[] = Array(iconCollectionNames.length).fill(0);
        iconCollectionNames.forEach((iconName, iconIndex) => {
            // Add a new row
            const iconNameHintRow: (string | null)[] = [];
            iconNameHintRows.push(iconNameHintRow);
            possibleSlotIconNames.forEach((possibleSlotIconNames, columnIndex) => {

                if (isDebugging) console.log(`iconIndex: ${iconIndex}, columnIndex: ${columnIndex}, possibleSlotIconNames: ${possibleSlotIconNames}`);

                if(possibleSlotIconNames.includes(iconName)) {
                    iconNameHintRow.push(iconName);
                    if(guessIconNames[columnIndex] !== undefined) {
                        numCertainIconNamesInHintRow[iconIndex]++;
                    }
                } else {
                    iconNameHintRow.push(null);
                }

                if (isDebugging) console.log('numCertainIconNamesInHintRow', numCertainIconNamesInHintRow);
            })

            if (isDebugging) console.log(`iconNameHintRow before minimization: ${iconNameHintRow}`);

            // Minimize the row by removing icons that are not certain and can't be correct
            // due to the already placed icons and the max possible icon occurrence limit
            if(numCertainIconNamesInHintRow[iconIndex] === iconsMinMax[iconIndex][1]) {

                if (isDebugging) console.log(`Row with iconIndex ${iconIndex} will be reduced!`);

                iconNameHintRow.forEach((entry: string | null, columnIndex: number) => {
                    // Remove entries that are not already filled during step 1
                    if(entry !== null && guessIconNames[columnIndex] === undefined) {
                        iconNameHintRow[columnIndex] = null;
                    }
                })
            }

            if (isDebugging) console.log(`iconNameHintRow after minimization: ${iconNameHintRow}`);
        })

        if (isDebugging) console.log("iconNameHintRows", iconNameHintRows);
        if (isDebugging) console.log("iconHintRowsCounts", numCertainIconNamesInHintRow);

        // Now update the possibleSlotIcons to get minimized possibleSlotColors!
        const reducedPossibleSlotIconsArray: string[][] = [];
        for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
            const reducedPossibleSlotIconNames: string[] = [];
            reducedPossibleSlotIconsArray.push(reducedPossibleSlotIconNames);
            for (let iconIndex = 0; iconIndex < iconCollectionNames.length; iconIndex++) {
                const iconEntry: string | null = iconNameHintRows[iconIndex][columnIndex];
                if (iconEntry !== null) {
                    reducedPossibleSlotIconNames.push(iconEntry);
                }
                if (isDebugging) console.log(`iconIndex: ${iconIndex}, columnIndex: ${columnIndex}, iconNameHintRows[iconIndex][columnIndex]: ${iconNameHintRows[iconIndex][columnIndex]}`);
            }
        }

        if (isDebugging) console.log("reducedPossibleSlotIconsArray", reducedPossibleSlotIconsArray);

        while (numNecessaryIcons > 0) {
            // Endless loop prevention
            cycles -= 1;
            checkCycles(cycles);

            // Filter the pairs to the icons that need to be placed
            const necessaryIconNamePairs = iconNameMinPairs.filter((iconNamePair) => iconNamePair[1] > 0);
            
            // Pick a necessary icon

            // Compute the number of possible slots for each icon
            const necessaryIconNamePossibleSlotPairs = necessaryIconNamePairs.map((pair): [string, number] => {
                const iconName = pair[0];
                let possibleSlotsForIconName = 0;
                for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
                    if (reducedPossibleSlotIconsArray[columnIndex].includes(iconName) &&
                        guessIconNames[columnIndex] === undefined) {
                        possibleSlotsForIconName++;
                    }
                }
                return [iconName, possibleSlotsForIconName];
            })
            
            // Start with the icon with the lowest number of possible slots
            necessaryIconNamePossibleSlotPairs.sort((a: [string, number], b: [string, number]) => {
                return a[1]-b[1];
            });

            const necessaryIconName = necessaryIconNamePossibleSlotPairs[0][0];

            const necessaryIconNamePair = necessaryIconNamePairs.find((pair: [string, number]) => {
                return pair[0] === necessaryIconName;
            })!;

            let isIconPlaced = false;
            const checkedSlotIndices: number[] = [];
            while (!isIconPlaced && remainingSlotIndices.length > 0) {
                // Endless loop prevention
                cycles -= 1;
                checkCycles(cycles);

                // Select a random slot, in which the icon is possible to add that icon in
                const slotIndicesLeftToCheck = remainingSlotIndices.filter((slotIndex) => {
                    return !checkedSlotIndices.includes(slotIndex);
                })

                if (slotIndicesLeftToCheck.length === 0) {
                    throw new Error(`Could not place one of the necessary icons, because there is no possible slot left for it!`);
                }

                const randomIndex = Math.floor(Math.random() * slotIndicesLeftToCheck.length);
                let remainingSlotIndex = slotIndicesLeftToCheck[randomIndex];

                if (reducedPossibleSlotIconsArray[remainingSlotIndex].includes(necessaryIconNamePair[0])) {
                    // icon is possible in this slot, add it!
                    const iconNameToPlace = necessaryIconNamePair[0];
                    
                    guessIconNames[remainingSlotIndex] = iconNameToPlace;

                    if (isDebugging) console.log('guessIconNames: ...');
                    if (isDebugging) console.log(guessIconNames);

                    // decrement min of the selected IconName-min-pair
                    let isDecremented = false;
                    let pairIndex = 0;
                    while (!isDecremented) {
                        // Endless loop prevention
                        cycles -= 1;
                        checkCycles(cycles);

                        const iconNameMinPair = iconNameMinPairs[pairIndex];
                        if (iconNameMinPair[0] === iconNameToPlace){
                            iconNameMinPair[1]--;
                            isDecremented = true;
                        } else {
                            pairIndex++;
                        }
                    }

                    // decrement numNecessaryColors
                    numNecessaryIcons--;

                    // decrement fitting iconNameMaxPair
                    iconNameMaxPairs.find((pair: [string, number]) => pair[0] === iconNameToPlace)![1]--;

                    // flag the selected icon as placed
                    isIconPlaced = true;

                    // remove slot from the remainingSlotIndices array
                    remainingSlotIndices.splice(randomIndex, 1);
                } 

                // Add the current randomIndex to the checkedSlotIndices
                checkedSlotIndices.push(randomIndex);
            }
            if (numNecessaryIcons > remainingSlotIndices.length) {
                // Necessary icons could not be placed!
                throw new Error("Cannot complete random guess, because there are no available slots left for the necessary icons! Check your min numbers!");
            }
        }

        // Step 3: Fill the remaining slots randomly, respecting the colorsMinMax max numbers
        while (remainingSlotIndices.length > 0) {
            // Endless loop prevention
            cycles -= 1;
            checkCycles(cycles);

            // Select the first remaining slot
            const remainingSlotIndex = remainingSlotIndices[0];

            // fill it with a random icon that can still be placed
            let isIconPlaced = false;
            while (!isIconPlaced) {
                // Endless loop prevention
                cycles -= 1;
                checkCycles(cycles);

                const possibleSlotIconNames = reducedPossibleSlotIconsArray[remainingSlotIndex];
                
                // eslint-disable-next-line no-loop-func
                possibleSlotIconNames.forEach(iconName => {
                    if (!isIconPlaced) {
                        // Check which the icons can still be placed
                        const possibleIconNameMaxPairs = iconNameMaxPairs.filter((pair: [string, number]) => {
                            if (pair[1] > 0 && possibleSlotIconNames.includes(pair[0])) return true;
                            return false;
                        })

                        if (possibleIconNameMaxPairs.length === 0) {
                            throw new Error(`Cannot fill slot with index ${remainingSlotIndex}, because no remaining icon could be found`);
                        }

                        // Select a random index to get a random possible icon
                        const randomIndex = Math.floor(Math.random() * possibleIconNameMaxPairs.length);

                        const iconNameToPlace = possibleIconNameMaxPairs[randomIndex][0];

                        // Place the iconName in the remaining slot
                        guessIconNames[remainingSlotIndex] = iconNameToPlace;

                        // decrement fitting iconNameMaxPair
                        iconNameMaxPairs.find((pair: [string, number]) => pair[0] === iconNameToPlace)![1]--;

                        // flag the selected icon as placed
                        isIconPlaced = true;

                        // remove slot from the remainingSlotIndices array
                        const metaIndex = remainingSlotIndices.indexOf(remainingSlotIndex);
                        remainingSlotIndices.splice(metaIndex, 1);
                    }
                })
            }
        }

        let areAllGuessIconsDefined = true;
        guessIconNames.forEach((iconName) => {
            if (iconName === undefined) areAllGuessIconsDefined = false;
        })

        if (!areAllGuessIconsDefined) throw new LoopFailureError("Couldn't complete random icon guess");

        // Check is this guess has already been placed
        let isAlreadyPlaced = false;

        for (let rowIndex = 1; rowIndex < activeRowIndex; rowIndex++) {
            const placedIconNameRow = gameRows[rowIndex].rowIconNames;
            if (guessIconNames.every((guessIconName, index) => guessIconName === placedIconNameRow[index])) {
                isAlreadyPlaced = true;
            }
        }

        // if already placed, get a new guess
        try {
            if (isAlreadyPlaced === true) return generateRandomIconGuess(state);
        } catch (error: unknown) {
            if (error instanceof Error && error.message === "too much recursion") {
                generateRandomIconGuess(state)
                // throw new Error("No possible remaining guess differs from any of the previous guesses!");
            }
            throw error;
        }

    } catch (error: unknown) {
        if (error instanceof CycleLimitError || error instanceof LoopFailureError) {
            // Could not generate a guess successfully within the given cycle bound, try again!

            if (isDebugging) console.warn(`Unsuccesfull loop! Loops left: ${loops -1 }`);

            return generateRandomIconGuess(state, loops - 1); 
        } else {
            if (error instanceof Error) {
                setModal({
                    messageHeader: 'Could not make random icon guess',
                    messageBody: error.message,
                    isVisible: true,
                })
            }
            return Array(numColumns).fill('');
        }
    }

    return guessIconNames as string[];
}

export default generateRandomIconGuess;
