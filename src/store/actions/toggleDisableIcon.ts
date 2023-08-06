import { zustandGetter, zustandSetter } from "../../interfaces/types";
import { gameState } from "../../interfaces/types";

const toggleDisableIcon = (set: zustandSetter, get: zustandGetter) => (iconName: string) => {
    const state = get();
    const { disabledIcons } = state.hints;
    if(disabledIcons === undefined) {
        throw new Error('Cannot disable icon, because disabled icons hints were not initialized!');
    }
    let newDisabledIcons = [...disabledIcons];
    // get icon index
    const { iconCollectionNames } = state.game;
    if(iconCollectionNames === undefined) {
        throw new Error('Cannot disable icon, because no icon collection was defined!');
    }
    const iconIndex = iconCollectionNames.indexOf(iconName);
    set((state: gameState) => {
        if (disabledIcons.includes(iconName)) {
            // Enable color
            newDisabledIcons = disabledIcons.filter(disabledIcon => disabledIcon !== iconName)
            // set max of this color to absolute max
            state.hints.iconsMinMax[iconIndex][1] = state.gameSettings.maxIdenticalColorsInSolution;
        } else {
            // disable color
            newDisabledIcons = [...disabledIcons, iconName];
            // set min and max of this color to 0
            state.hints.iconsMinMax[iconIndex][0] = 0;
            state.hints.iconsMinMax[iconIndex][1] = 0;
            // remove this icon from the possibleSlotIcons for all slots
            state.hints.possibleSlotIconNames.forEach((possibleIconNames, columnIndex) => {
                possibleIconNames = possibleIconNames.filter(possibleIcon => possibleIcon !== iconName);
                state.hints.possibleSlotIconNames[columnIndex] = possibleIconNames
            });
            
        }
        state.hints.disabledIcons = newDisabledIcons;
    }, false, 'toggleDisableIcon');
}

export default toggleDisableIcon;