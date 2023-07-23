import { zustandGetter, zustandSetter } from "../../interfaces/types";
import Colors from "../../util/Colors";
import { gameState } from "../../interfaces/types";

const setColorMinMax = (set: zustandSetter, get: zustandGetter) =>
    ({colorIndex, min, max}: {colorIndex: number, min?: number, max?: number}) => {
    set((state: gameState) => {
        const { numColors, maxIdenticalColorsInSolution } = state.gameSettings;
        if (min !== undefined) {
            const step = min - state.hints.colorsMinMax[colorIndex][0];
            state.hints.colorsMinMax[colorIndex][0] = min;
            // decrement the max values of all other colors
            for (let i = 0; i < numColors; i++) {
                const newMax = state.hints.colorsMinMax[i][1] - step;
                if (i !== colorIndex &&
                    // new max must respect boundaries
                    newMax > 0 &&
                    newMax <= maxIdenticalColorsInSolution &&
                    // the new max must not fall below the min!
                    newMax >= state.hints.colorsMinMax[i][0]
                    ) {
                    state.hints.colorsMinMax[i][1] -= step;
                }
            }
        }
        if (max !== undefined) {
            // Enable color, if max was 0 and is set to a different value
            if (state.hints.colorsMinMax[colorIndex][1] === 0 && max !== 0) {
                const paletteColors = Colors.deserialize(state.game.paletteColorsDataString);
                const disabledColors = Colors.deserialize(state.hints.disabledColorsDataString);
                const color = paletteColors[colorIndex];
                if (disabledColors.has(color)) {
                    disabledColors.remove(color);
                    state.hints.disabledColorsDataString = Colors.serialize(disabledColors);
                }
            }
            state.hints.colorsMinMax[colorIndex][1] = max;
            // Disable color, if max is set to 0
            if (max === 0) {
                const paletteColors = Colors.deserialize(state.game.paletteColorsDataString);
                const disabledColors = Colors.deserialize(state.hints.disabledColorsDataString);
                const color = paletteColors[colorIndex];
                if (!disabledColors.has(color)) {
                    disabledColors.add(color);
                    state.hints.disabledColorsDataString = Colors.serialize(disabledColors);
                }
                // remove this color from the possibleSlotColors for all slots
                // Note: This is a duplication of the code in toggleDisableColor
                // TODO: Check whether this can be solved via some kind of "reaction"
                state.hints.possibleSlotColorsDataStrings.forEach((possibleSlotColorsDataString, index) => {
                const possibleSlotColors = Colors.deserialize(possibleSlotColorsDataString);
                possibleSlotColors.remove(color);
                state.hints.possibleSlotColorsDataStrings[index] = Colors.serialize(possibleSlotColors);
            })
            }
        }
    }, false, 'setColorMinMax');
}

export default setColorMinMax;