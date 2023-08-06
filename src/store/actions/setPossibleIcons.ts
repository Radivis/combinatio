import { zustandGetter, zustandSetter } from "../../interfaces/types";
import { gameState } from "../../interfaces/types";

const setPossibleIcons = (set: zustandSetter, get: zustandGetter) => (iconNames: string[], columnIndex: number) => {
    set((state: gameState) => {
        const { iconCollectionNames } = state.game;
        // const { colorsMinMax } = state.hints;
        const { numIcons, maxIdenticalColorsInSolution } = state.gameSettings;

        // Set the possible iconNames to the provided iconNames array
        state.hints.possibleSlotIconNames[columnIndex] = iconNames;

        // TODO: Do the rest of this function

        // Increment the min of a color to the number of slots in which it appears certainly

        // First figure out how many certain slots are there for each color
        // const colorCertainSlotNumberPairs = paletteColors
        //     .map((color: Color): [Color, number] => {
        //         return [color, 0];
        //     })
        // const { possibleSlotColorsDataStrings } = state.hints;
        // const { numColumns } = state.gameSettings;
        // for (let _columnIndex = 0; _columnIndex < numColumns; _columnIndex++) {
        //     const possibleSlotColors = Colors.deserialize(possibleSlotColorsDataStrings[_columnIndex]);
        //     if (possibleSlotColors.length === 1) {
        //         const certainColor = possibleSlotColors[0];
        //         // Increment the corresponding colorCertainSlotNumberPair
        //         const colorCertainSlotNumberPair = colorCertainSlotNumberPairs
        //             .find((colorCertainSlotNumberPair: [Color, number]) => {
        //             return certainColor.equals(colorCertainSlotNumberPair[0]);
        //         })!;
        //         colorCertainSlotNumberPair[1]++;
        //     }
        // }

        // Actually increment the min numbers of each color

        // paletteColors.forEach((color) => {
        //     const colorCertainSlotNumberPair = colorCertainSlotNumberPairs.find((colorCertainSlotNumberPair: [Color, number]) => {
        //         return color.equals(colorCertainSlotNumberPair[0])})!;
        //     const numCertainSlots = colorCertainSlotNumberPair[1];
        //     const colorIndex = paletteColors.indexOfColor(color);
        //     const colorMin = colorsMinMax[colorIndex][0];
        //     if (colorMin < numCertainSlots) {
        //         colorsMinMax[colorIndex][0] = numCertainSlots;
                
        //         // decrement the max values of all other colors

        //         // How many color occurences are already fixed?
        //         const minTotal = state.hints.colorsMinMax.reduce((prev: number,curr: [number, number]): number => {
        //             return prev + curr[0];
        //         },0);
        //         // How many slots can still be filled?
        //         const numRemainingSlots = numColumns - minTotal;   

        //         const step = numCertainSlots - state.hints.colorsMinMax[colorIndex][0];            
        //         for (let i = 0; i < numColors; i++) {
        //             const prevMax = state.hints.colorsMinMax[i][1];
        //             if (numRemainingSlots <= prevMax) {
        //                 const newMax = prevMax - step;
        //                 if (i !== colorIndex &&
        //                     // new max must respect boundaries
        //                     newMax > 0 &&
        //                     newMax <= maxIdenticalColorsInSolution &&
        //                     // the new max must not fall below the min!
        //                     newMax >= state.hints.colorsMinMax[i][0]
        //                     ) {
        //                     state.hints.colorsMinMax[i][1] -= step;
        //                 }
        //             }
        //         }
        //     }
        // });
    }, false, 'setPossibleIcons')
}

export default setPossibleIcons;