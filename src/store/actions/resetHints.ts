import { zustandGetter, zustandSetter } from "../../interfaces/types";
import { gameState } from "../../interfaces/types";
import { emptyCombinationNote } from "../../constants";

const resetHints = (set: zustandSetter, get: zustandGetter) => () => {
    const settings = get().gameSettings;
    const { numColors, numColumns, maxIdenticalColorsInSolution } = settings;
    set((state: gameState) => {
        const blankHints = {
            colorsMinMax: Array(numColors).fill([...[0, maxIdenticalColorsInSolution]]),
            possibleSlotColorsDataStrings: Array(numColumns)
            .fill(state.game.paletteColorsDataString),
            disabledColorsDataString: '[]',
            combinationNotes: Array(2).fill([...emptyCombinationNote]),
        }
        state.hints = blankHints;
        state.hints.colorsMinMax = blankHints.colorsMinMax;
    }, false, 'resetHints');
}

export default resetHints;