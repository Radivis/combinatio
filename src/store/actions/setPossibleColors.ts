import { zustandGetter, zustandSetter } from "../../interfaces/types";
import Color from "../../util/Color";
import Colors from "../../util/Colors";
import { gameState } from "../../interfaces/types";

const setPossibleColors = (set: zustandSetter, get: zustandGetter) => (colors: Colors, columnIndex: number) => {
    set((state: gameState) => {
        const paletteColors = Colors.deserialize(state.game.paletteColorsDataString);
        const { colorsMinMax } = state.hints;
        const { numColors, maxIdenticalColorsInSolution } = state.settings;

        // Set the possible colors to the provided Colors instance
        state.hints.possibleSlotColorsDataStrings[columnIndex] = Colors.serialize(colors);

        // Increment the min of a color to the number of slots in which it appears certainly

        // First figure out how many certain slots are there for each color
        const colorCertainSlotNumberPairs = paletteColors
            .map((color: Color): [Color, number] => {
                return [color, 0];
            })
        const { possibleSlotColorsDataStrings } = state.hints;
        const { numColumns } = state.settings;
        for (let _columnIndex = 0; _columnIndex < numColumns; _columnIndex++) {
            const possibleSlotColors = Colors.deserialize(possibleSlotColorsDataStrings[_columnIndex]);
            if (possibleSlotColors.length === 1) {
                const certainColor = possibleSlotColors[0];
                // Increment the corresponding colorCertainSlotNumberPair
                const colorCertainSlotNumberPair = colorCertainSlotNumberPairs
                    .find((colorCertainSlotNumberPair: [Color, number]) => {
                    return certainColor.equals(colorCertainSlotNumberPair[0]);
                })!;
                colorCertainSlotNumberPair[1]++;
            }
        }

        // Actually increment the min numbers of each color

        paletteColors.forEach((color) => {
            const colorCertainSlotNumberPair = colorCertainSlotNumberPairs.find((colorCertainSlotNumberPair: [Color, number]) => {
                return color.equals(colorCertainSlotNumberPair[0])})!;
            const numCertainSlots = colorCertainSlotNumberPair[1];
            const colorIndex = paletteColors.indexOfColor(color);
            const colorMin = colorsMinMax[colorIndex][0];
            if (colorMin < numCertainSlots) {
                colorsMinMax[colorIndex][0] = numCertainSlots;
                
                // decrement the max values of all other colors
                const step = numCertainSlots - state.hints.colorsMinMax[colorIndex][0];            
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

        });

    }, false, 'setPossibleColors')
}

export default setPossibleColors;