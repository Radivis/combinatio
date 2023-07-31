import { colorsDataString } from '../../interfaces/types';
import Colors from '../../util/Colors';
import Color from '../../util/Color';
import ColorPin from '../ColorPin/ColorPin';

import './SlotHintIconColumn.css';
import useGameStore from '../../store/gameStore';
import { holeColor } from '../../constants';

interface slotHintColumnProps {
    columnIndex: number,
}

const SlotHintIconColumn = (props: slotHintColumnProps) => {
    const { columnIndex } = props;

    const {
        colorsMinMax,
        disabledIcons,
        iconCollectionNames,
        possibleCurrentSlotIconNames,
        possibleSlotIconNames,
        // setColorMinMax,
        setPossibleIcons,
    } = useGameStore((state) => {
        const { colorsMinMax, disabledIcons, possibleSlotIconNames } = state.hints;
        const possibleCurrentSlotIconNames = state.hints.possibleSlotIconNames[columnIndex];
        const { iconCollectionNames } = state.game;
        const { setPossibleIcons, setColorMinMax } = state;
        return {
            colorsMinMax,
            disabledIcons,
            iconCollectionNames,
            possibleCurrentSlotIconNames,
            possibleSlotIconNames,
            // setColorMinMax,
            setPossibleIcons,
        };
    });

    // compute number of slots in which this icon is theoretically possible,
    // disregarding the limitation given by maxIdenticalColorsInSolution
    const computeNumIconPossible = (iconName: string): number => {
        let numIconPossible = 0;
        possibleSlotIconNames.forEach((_possibleSlotIconNames: string[]) => {
            if (_possibleSlotIconNames.includes(iconName)) numIconPossible++;
        })
        return numIconPossible;
    }

    const opacityToogleCallback = (iconName: Color | string) => {
        if (typeof iconName === 'string') {
            // compute number of slots in which this  is possible
            const numColorPossible = computeNumIconPossible(iconName);
    
            // get index of color in colorsPalette
            const colorIndex = iconCollectionNames.indexOf(iconName);
    
            if (possibleCurrentSlotIconNames.includes(iconName)) {
                // Icon was possible, must now be removed from possible colors
                possibleCurrentSlotIconNames.splice(possibleCurrentSlotIconNames.indexOf(iconName), 1);
                // Decrement max of this color, if max in sync
                // TODO: Adapt this code, once iconsMinMax is implemented
                // if (colorsMinMax[colorIndex][1] === numColorPossible) {
                //     setColorMinMax({colorIndex, max: numColorPossible - 1});
                // }
            } else {
                // Color was impossible, must now be added to possible colors
                possibleCurrentSlotIconNames.push(iconName);
                // Don't increment max of this color, because max might have been reduced on purpose!
                // const newMax = Math.min(numColorPossible + 1, maxIdenticalColorsInSolution);
                // setColorMinMax({colorIndex, max: newMax});
            }
            setPossibleIcons(possibleCurrentSlotIconNames, columnIndex);
        }
    }

    const isHighlighted = (iconName: string): boolean => {
        return possibleCurrentSlotIconNames.length === 1 && possibleCurrentSlotIconNames.includes(iconName);
    }

    return (
        <div className='slot-hint-column'>
            {iconCollectionNames.map((iconName: string) => {
                return (
                    <ColorPin
                        key={iconName}
                        color={holeColor}
                        iconName={iconName}
                        isDisabled={disabledIcons.includes(iconName)}
                        isOpaque={!possibleCurrentSlotIconNames.includes(iconName)}
                        isOpacityToogleActive={true}
                        isHighlighted={isHighlighted(iconName)}
                        opacityToogleCallback={opacityToogleCallback}
                    />
                );
            })}
        </div>
    );
};

export default SlotHintIconColumn;