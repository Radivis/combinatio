/*
Redux reducer for the game
*/

import { createDraftSafeSelector, createSlice } from "@reduxjs/toolkit";

import Color from "../../util/Color";
import Colors from "../../util/Colors";
import { range } from "../../util/range";
import { gameStates, holeHue, holeLightness, holeSaturation } from "../../constants";

const selectSelf = (state: any) => state;
const numColumns = createDraftSafeSelector(
  selectSelf,
  (state: any) => state.settings.numColumns
)

const holeColor = Color.makeHsl(holeHue, holeSaturation, holeLightness);

const defaultStartColorArray: Color[] = range(numColumns(state)).map(i => {
    return holeColor;
});

const generateSolutionColors = (): Colors => {
    const baseColors: Colors = Colors.deserialize(baseColorsDataString);
    const solutionColors: Color[] = [];
    // Implicit assumption: All colors have different hues!
    const colorHueCountPairs = baseColors.map((color: Color) => [color.hue, maxIdenticalColorsInSolution]);
    console.log('colorHueCountPairs', colorHueCountPairs);
    let slotsLeft = numColumns;
    while (slotsLeft > 0) {
        const randomColorHueCountPair = colorHueCountPairs[~~(Math.random()*(colorHueCountPairs.length))];
        console.log('randomColorHueCountPair', randomColorHueCountPair);
        // Decrement the count of the chosen color
        randomColorHueCountPair[1] -= 1;
        // If the count has reached zero, remove the pair from the array
        if (randomColorHueCountPair[1] === 0) {
            const pairIndex = colorHueCountPairs.indexOf(randomColorHueCountPair);
            colorHueCountPairs.splice(pairIndex, 1);
        }
        console.log('colorHueCountPairs after reduction', colorHueCountPairs);
        // Add the chosen color to the solution and decrement the slot counter
        const solutionColor = baseColors.find((color: Color) => color.hue === randomColorHueCountPair[0]);
        if (solutionColor !== undefined) {
            solutionColors.push(solutionColor);
            slotsLeft--;
        }
    }
    return new Colors(solutionColors);
};

const initialState = {
    activeRowIndex: 0,
    solutionColors: [...defaultStartColorArray],
    gameState: gameStates[0],
    timerSeconds: 0,
}

// createSlice uses the package Immer, which allows to write reducers in the "mutable style"
export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        start: (state, action) => {

        },
        restart: (state) => {
            
        },
        win: (state) => {

        },
        lose: (state) => {

        },
    }
})

export const {
    restart,
} = gameSlice.actions

export default gameSlice.reducer