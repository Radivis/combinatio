import { zustandGetter, zustandSetter } from "../../interfaces/types";
import { gameState } from "../../interfaces/types";

const setIconMinMax = (set: zustandSetter, get: zustandGetter) =>
    ({iconIndex, min, max}: {iconIndex: number, min?: number, max?: number}) => {
    set((state: gameState) => {
        const { numIcons, maxIdenticalIconsInSolution, numColumns } = state.gameSettings;
        const { iconCollectionNames }= state.game;
        if (min !== undefined) {
            // How many icon occurences are already fixed?
            const minTotal = state.hints.iconsMinMax.reduce((prev: number,curr: [number, number]): number => {
                return prev + curr[0];
            },0);
            // How many slots can still be filled?
            const numRemainingSlots = numColumns - minTotal;   

            const step = min - state.hints.iconsMinMax[iconIndex][0];
            state.hints.iconsMinMax[iconIndex][0] = min;
            // decrement the max values of all other icons
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
        if (max !== undefined) {
            // Enable icon, if max was 0 and is set to a different value
            if (state.hints.iconsMinMax[iconIndex][1] === 0 && max !== 0) {
                let disabledIcons = state.hints.disabledIcons;
                const iconName = iconCollectionNames[iconIndex];
                if (disabledIcons.includes(iconName)) {
                    disabledIcons = disabledIcons.filter(disabledIcon => disabledIcon !== iconName);
                    state.hints.disabledIcons = disabledIcons;
                }
            }
            state.hints.iconsMinMax[iconIndex][1] = max;
            // Disable color, if max is set to 0
            if (max === 0) {
                let disabledIcons = state.hints.disabledIcons;
                const iconName = iconCollectionNames[iconIndex];
                if (!disabledIcons.includes(iconName)) {
                    disabledIcons.push(iconName);
                    state.hints.disabledIcons = disabledIcons;
                }
                // remove this color from the possibleSlotColors for all slots
                // Note: This is a duplication of the code in toggleDisableColor
                // TODO: Check whether this can be solved via some kind of "reaction"
                state.hints.possibleSlotIconNames.forEach((possibleIconNames, columnIndex) => {
                    possibleIconNames = possibleIconNames.filter(possibleIcon => possibleIcon !== iconName);
                    state.hints.possibleSlotIconNames[columnIndex] = possibleIconNames
                });
            }
        }
    }, false, 'setIconMinMax');
}

export default setIconMinMax;