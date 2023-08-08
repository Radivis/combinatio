import { zustandGetter, zustandSetter } from "../../interfaces/types";
import Colors from "../../util/Colors";
import { gameState } from "../../interfaces/types";

const setColorMinMax = (set: zustandSetter, get: zustandGetter) =>
    ({colorIndex, min, max}: {colorIndex: number, min?: number, max?: number}) => {
    set((state: gameState) => {
        const { numColors, maxIdenticalColorsInSolution, numColumns } = state.gameSettings;
        const { changeMaxOccurrencesOnChangingMinOccurrences } = state.displaySettings;
        if (min !== undefined) {
            // How many color occurences are already fixed?
            const minTotal = state.hints.colorsMinMax
                .reduce((prev: number, curr: [number, number]): number => {
                return prev + curr[0];
            },0);
            // How many slots can still be filled?
            const numRemainingSlots = numColumns - minTotal;   

            const step = min - state.hints.colorsMinMax[colorIndex][0];
            state.hints.colorsMinMax[colorIndex][0] = min;
            if (changeMaxOccurrencesOnChangingMinOccurrences === true) {
                // decrement the max values of all other colors
                for (let i = 0; i < numColors; i++) {
                    const prevMax = state.hints.colorsMinMax[i][1];
                    if (numRemainingSlots <= prevMax) {
                        const newMax = prevMax - step;
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