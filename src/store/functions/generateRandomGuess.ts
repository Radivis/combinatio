import Color from "../../util/Color";
import Colors from "../../util/Colors";
import { gameActions, gameState, } from "../gameStore";
import { defaultRowColorsDataString } from '../gameStore';

/**
 * Generates a random guess for the currently active game row
 * 
 * @param {gameState} state - The current state of the game
 * @returns {Colors} - the new random guess as Colors instance
 */
const generateRandomGuess = (state: gameState & gameActions): Colors => {

    const { setModal } = state;
    const { numColumns } = state.settings;
    const { paletteColorsDataString, activeRowIndex, gameRows } = state.game;
    const paletteColors: Colors = Colors.deserialize(paletteColorsDataString);
    const {
        colorsMinMax,
        possibleSlotColorsDataStrings
    } = state.hints;
    // Start with a color array with all slots undefined
    const guessColors: (Color | undefined)[] = Array(numColumns).fill(undefined);
    // Implicit assumption: All colors have different hues!

    const colorMaxPairs: [Color, number][] = paletteColors.map((color, colorIndex) => {
        const colorMax = colorsMinMax[colorIndex][1];
        return [color, colorMax];
    })

    try {

        // Step 1: Fill all "certain" slots
        for (let slotIndex = 0; slotIndex < numColumns; slotIndex++) {
            const possibleSlotColors = Colors.deserialize(possibleSlotColorsDataStrings[slotIndex]);

            if (possibleSlotColors.length === 0) {
                throw new Error(`Cannot place random guess, because no colors are possible for slot number ${slotIndex}`);
            }

            if (possibleSlotColors.length === 1) {
                // if there is only one possible color, select that for this slot!
                const colorToPlace = possibleSlotColors[0];
                guessColors[slotIndex] = colorToPlace;

                // decrement fitting colorMaxPair
                colorMaxPairs.find((pair: [Color, number]) => pair[0].equals(colorToPlace))![1]--;
            }
        }

        // Step 2: Fill slots until the colorsMinMax min numbers are satisfied
        const colorMinPairs: [Color, number][] = paletteColors.map((color, colorIndex) => {
            const colorMin = colorsMinMax[colorIndex][0];
            return [color, colorMin];
        })

        // Check whether necessary colors have already been placed in step 1
        colorMinPairs.forEach((colorMinPair: [Color, number]) => {
            if (colorMinPair[1] > 0) {
                // Check each slot, whether the color already has been placed there
                guessColors.forEach((color, slotIndex) => {
                    if (color !== undefined && colorMinPair[0].equals(color)) {
                        // decrement colorMax
                        colorMinPair[1]--;
                    }
                })
            }
        })

        // Fill random slots with necessary colors
        let numNecessaryColors = colorMinPairs.reduce((acc, colorMinPair) => colorMinPair[1] + acc, 0);
        
        // Get the indices of the slots yet to be filled
        let remainingSlotIndices: number[] = [];
        guessColors.forEach((color, index) => {
            if (color === undefined) remainingSlotIndices.push(index);
        })

        // Throw an error, if the number of necessary colors exceeds the number of columns!
        if (numNecessaryColors > remainingSlotIndices.length) {
            throw new Error(`Cannot place more colors than there are free slots! Check your min numbers!`)
        }

        while (numNecessaryColors > 0) {
            // Filter the pairs to the colors that need to be placed
            const necessaryColorPairs = colorMinPairs.filter((colorPair) => colorPair[1] > 0);
            
            // Pick a necessary color

            // Compute the number of possible slots for each color
            const necessaryColorPossibleSlotPairs = necessaryColorPairs.map((pair): [Color, number] => {
                const color = pair[0];
                let possibleSlotsForColor = 0;
                for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
                    if (Colors.deserialize(possibleSlotColorsDataStrings[columnIndex])
                    .has(pair[0]) && guessColors[columnIndex] === undefined) {
                        possibleSlotsForColor++;
                    }
                }
                return [color, possibleSlotsForColor];
            })
            
            // Start with the color with the lowest number of possible slots
            necessaryColorPossibleSlotPairs.sort((a: [Color, number], b: [Color, number]) => {
                return a[1]-b[1];
            });

            const necessaryColor = necessaryColorPossibleSlotPairs[0][0];

            const necessaryColorPair = necessaryColorPairs.find((pair: [Color, number]) => {
                return pair[0].equals(necessaryColor);
            })!;

            let isColorPlaced = false;
            const checkedSlotIndices = [];
            while (!isColorPlaced && remainingSlotIndices.length > 0) {
                // Select a random slot, in which the color is possible to add that color in
                const randomIndex = Math.floor(Math.random() * remainingSlotIndices.length);
                let remainingSlotIndex = remainingSlotIndices[randomIndex];

                if (Colors.deserialize(possibleSlotColorsDataStrings[remainingSlotIndex])
                    .has(necessaryColorPair[0])) {
                    // color is possible in this slot, add it!
                    const colorToPlace = necessaryColorPair[0];
                    
                    guessColors[remainingSlotIndex] = colorToPlace;

                    // decrement min of the selected Color-min-pair
                    let isDecremented = false;
                    let pairIndex = 0;
                    while (!isDecremented) {
                        const colorMinPair = colorMinPairs[pairIndex];
                        if (colorMinPair[0].equals(colorToPlace)){
                            colorMinPair[1]--;
                            isDecremented = true;
                        } else {
                            pairIndex++;
                        }
                    }

                    // decrement numNecessaryColors
                    numNecessaryColors--;

                    // decrement fitting colorMaxPair
                    colorMaxPairs.find((pair: [Color, number]) => pair[0].equals(colorToPlace))![1]--;

                    // flag the selected color as placed
                    isColorPlaced = true;

                    // remove slot from the remainingSlotIndices array
                    remainingSlotIndices.splice(randomIndex, 1);
                } 

                // Add the current randomIndex to the checkedSlotIndices to force this loop to terminate
                checkedSlotIndices.push(randomIndex);
            }
            if (numNecessaryColors > remainingSlotIndices.length) {
                // Necessary colors could not be placed!
                throw new Error("Cannot complete random guess, because there are no available slots left for the necessary colors! Check your min numbers!");
            }
        }

        // Step 3: Fill the remaining slots randomly, respecting the colorsMinMax max numbers
        while (remainingSlotIndices.length > 0) {
            // Select the first remaining slot
            const remainingSlotIndex = remainingSlotIndices[0];

            // fill it with a random color that can still be placed
            let isColorPlaced = false;
            while (!isColorPlaced) {
                const possibleSlotColors = Colors.deserialize(possibleSlotColorsDataStrings[remainingSlotIndex]);
                
                // eslint-disable-next-line no-loop-func
                possibleSlotColors.forEach(color => {
                    if (!isColorPlaced) {
                        // Check which the colors can still be placed
                        const possibleColorMaxPairs = colorMaxPairs.filter((pair: [Color, number]) => {
                            if (pair[1] > 0 && possibleSlotColors.has(pair[0])) return true;
                            return false;
                        })

                        if (possibleColorMaxPairs.length === 0) {
                            throw new Error(`Cannot fill slot with index ${remainingSlotIndex}, because no remaining color could be found`);
                        }

                        // Select a random index to get a random possible color
                        const randomIndex = Math.floor(Math.random() * possibleColorMaxPairs.length);

                        const colorToPlace = possibleColorMaxPairs[randomIndex][0];

                        // Place the color in the remaining slot
                        guessColors[remainingSlotIndex] = colorToPlace;

                        // decrement fitting colorMaxPair
                        colorMaxPairs.find((pair: [Color, number]) => pair[0].equals(colorToPlace))![1]--;

                        // flag the selected color as placed
                        isColorPlaced = true;

                        // remove slot from the remainingSlotIndices array
                        const metaIndex = remainingSlotIndices.indexOf(remainingSlotIndex);
                        remainingSlotIndices.splice(metaIndex, 1);
                    }
                })
            }
        }

        let areAllGuessColorsDefined = true;
        guessColors.forEach((color) => {
            if (color === undefined) areAllGuessColorsDefined = false;
        })

        if (!areAllGuessColorsDefined) throw new Error("Couldn't complete random guess");

        // Check is this guess has already been placed
        let isAlreadyPlaced = false;

        for (let rowIndex = 1; rowIndex < activeRowIndex; rowIndex++) {
            const placedColorRow = Colors.deserialize(gameRows[rowIndex].rowColorsDataString);
            if (new Colors(guessColors as Color[]).equals(placedColorRow)) isAlreadyPlaced = true;
        }

        if (isAlreadyPlaced === true) {
            console.log("Guess already placed!");
        }

        // if already placed, get a new guess
        try {
            if (isAlreadyPlaced === true) return generateRandomGuess(state);
        } catch (error: unknown) {
            if (error instanceof Error && error.message === "too much recursion") {
                throw new Error("No possible remaining guess differs from any of the previous guesses!");
            }
            throw error;
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            setModal({
                messageHeader: 'Could not make random guess',
                messageBody: error.message,
                isVisible: true,
            })
        }
        return Colors.deserialize(defaultRowColorsDataString(numColumns));
    }

    return new Colors(guessColors as Color[]);
}

export default generateRandomGuess;
