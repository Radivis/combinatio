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
            // TODO: Adapt this to icons
            /*
            // set min and max of this color to 0
            state.hints.colorsMinMax[iconIndex][0] = 0;
            state.hints.colorsMinMax[iconIndex][1] = 0;
            // remove this color from the possibleSlotColors for all slots
            state.hints.possibleSlotColorsDataStrings.forEach((possibleSlotColorsDataString, index) => {
                const possibleSlotColors = Colors.deserialize(possibleSlotColorsDataString);
                possibleSlotColors.remove(iconName);
                state.hints.possibleSlotColorsDataStrings[index] = Colors.serialize(possibleSlotColors);
            })
            */
        }
        state.hints.disabledIcons = newDisabledIcons;
    }, false, 'toggleDisableIcon');
}

export default toggleDisableIcon;