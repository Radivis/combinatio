import { zustandGetter, zustandSetter } from "../../interfaces/types";
import { gameState } from "../../interfaces/types";

const setPossibleIcons = (set: zustandSetter, get: zustandGetter) => (iconNames: string[], columnIndex: number) => {
    set((state: gameState) => {
        const { iconCollectionNames } = state.game;
        const { iconsMinMax } = state.hints;
        const { numIcons, maxIdenticalIconsInSolution } = state.gameSettings;

        // Set the possible iconNames to the provided iconNames array
        state.hints.possibleSlotIconNames[columnIndex] = iconNames;

        // Increment the min of an icon to the number of slots in which it appears certainly

        // First figure out how many certain slots are there for each color
        const colorCertainSlotNumberPairs = iconCollectionNames
            .map((iconName: string): [string, number] => {
                return [iconName, 0];
            })
        const { possibleSlotIconNames } = state.hints;
        const { numColumns } = state.gameSettings;
        for (let _columnIndex = 0; _columnIndex < numColumns; _columnIndex++) {
            const possibleSlotIcons = possibleSlotIconNames[_columnIndex];
            if (possibleSlotIcons.length === 1) {
                const certainIconName = possibleSlotIcons[0];
                // Increment the corresponding iconNameCertainSlotNumberPair
                const iconNameCertainSlotNumberPair = colorCertainSlotNumberPairs
                    .find((colorCertainSlotNumberPair: [string, number]) => {
                    return certainIconName === colorCertainSlotNumberPair[0];
                })!;
                iconNameCertainSlotNumberPair[1]++;
            }
        }

        // Actually increment the min numbers of each icon

        iconCollectionNames.forEach((iconName: string) => {
            const iconNameCertainSlotNumberPair = colorCertainSlotNumberPairs.find((iconNameCertainSlotNumberPair: [string, number]) => {
                return iconName === iconNameCertainSlotNumberPair[0]})!;
            const numCertainSlots = iconNameCertainSlotNumberPair[1];
            const iconIndex =iconCollectionNames.indexOf(iconName);
            const iconMin = iconsMinMax[iconIndex][0];
            if (iconMin < numCertainSlots) {
                iconsMinMax[iconIndex][0] = numCertainSlots;
                
                // decrement the max values of all other icons

                // How many icons occurences are already fixed?
                const minTotal = state.hints.iconsMinMax.reduce((prev: number,curr: [number, number]): number => {
                    return prev + curr[0];
                },0);
                // How many slots can still be filled?
                const numRemainingSlots = numColumns - minTotal;   

                const step = numCertainSlots - state.hints.iconsMinMax[iconIndex][0];            
                for (let i = 0; i < numIcons; i++) {
                    const prevMax = state.hints.iconsMinMax[i][1];
                    if (numRemainingSlots <= prevMax) {
                        const newMax = prevMax - step;
                        if (i !== iconIndex &&
                            // new max must respect boundaries
                            newMax > 0 &&
                            newMax <= maxIdenticalIconsInSolution &&
                            // the new max must not fall below the min!
                            newMax >= state.hints.iconsMinMax[i][0]
                            ) {
                            state.hints.iconsMinMax[i][1] -= step;
                        }
                    }
                }
            }
        });
    }, false, 'setPossibleIcons')
}

export default setPossibleIcons;