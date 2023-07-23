import { zustandGetter, zustandSetter } from "../../interfaces/types";
import Color from "../../util/Color";
import Colors from "../../util/Colors";
import { gameState } from "../../interfaces/types";

const toggleDisableColor = (set: zustandSetter, get: zustandGetter) => (color: Color) => {
    const state = get();
    const disabledColors = Colors.deserialize(state.hints.disabledColorsDataString);
    // get color index
    const paletteColors = Colors.deserialize(state.game.paletteColorsDataString);
    const colorIndex = paletteColors.indexOfColor(color);
    set((state: gameState) => {
        if (disabledColors.has(color)) {
            // Enable color
            disabledColors.remove(color);
            // set max of this color to absolute max
            state.hints.colorsMinMax[colorIndex][1] = state.settings.maxIdenticalColorsInSolution;
        } else {
            // disable color
            disabledColors.add(color);
            // set min and max of this color to 0
            state.hints.colorsMinMax[colorIndex][0] = 0;
            state.hints.colorsMinMax[colorIndex][1] = 0;
            // remove this color from the possibleSlotColors for all slots
            state.hints.possibleSlotColorsDataStrings.forEach((possibleSlotColorsDataString, index) => {
                const possibleSlotColors = Colors.deserialize(possibleSlotColorsDataString);
                possibleSlotColors.remove(color);
                state.hints.possibleSlotColorsDataStrings[index] = Colors.serialize(possibleSlotColors);
            })
        }
        state.hints.disabledColorsDataString = Colors.serialize(disabledColors);
    }, false, 'toggleDisableColor');
}

export default toggleDisableColor;