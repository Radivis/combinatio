import Color from '../../util/Color';

import './SlotHintIconColumn.css';
import useGameStore from '../../store/gameStore';
import Icon from '../Icon/Icon';
import Drag from '../Drag/Drag';

interface slotHintColumnProps {
    columnIndex: number,
}

const SlotHintIconColumn = (props: slotHintColumnProps) => {
    const { columnIndex } = props;

    const {
        changeOccurrencesOnChangingPossibleSlots,
        iconsMinMax,
        disabledIcons,
        iconCollectionNames,
        possibleSlotIconNames,
        setIconMinMax,
        setPossibleIcons,
    } = useGameStore((state) => {
        const { iconsMinMax, disabledIcons, possibleSlotIconNames } = state.hints;
        const { iconCollectionNames } = state.game;
        const { setPossibleIcons, setIconMinMax } = state;
        const { changeOccurrencesOnChangingPossibleSlots } = state.displaySettings;
        return {
            changeOccurrencesOnChangingPossibleSlots,
            iconsMinMax,
            disabledIcons,
            iconCollectionNames,
            possibleSlotIconNames,
            setIconMinMax,
            setPossibleIcons,
        };
    });

    let { possibleCurrentSlotIconNames } = useGameStore((state) => {
        const possibleCurrentSlotIconNames = state.hints.possibleSlotIconNames[columnIndex];
        return { possibleCurrentSlotIconNames };
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
            const numIconPossible = computeNumIconPossible(iconName);
    
            // get index of icon in iconCollectionNames
            const iconIndex = iconCollectionNames.indexOf(iconName);
    
            if (possibleCurrentSlotIconNames.includes(iconName)) {
                // Icon was possible, must now be removed from possible colors
                possibleCurrentSlotIconNames=possibleCurrentSlotIconNames.filter(_iconName => {
                    return _iconName !== iconName;
                });

                // Splice doesn't work here, because the entries of the array are read-only!
                // possibleCurrentSlotIconNames.splice(possibleCurrentSlotIconNames.indexOf(iconName), 1);

                if (changeOccurrencesOnChangingPossibleSlots === true) {
                    // Decrement max of this icon, if max in sync
                    if (iconsMinMax[iconIndex][1] === numIconPossible) {
                        setIconMinMax({iconIndex, max: numIconPossible - 1});
                    }
                }
            } else {
                // Color was impossible, must now be added to possible colors
                // Make a copy of the possibleCurrentSlotIconNames, because it has read-only length!
                const newPossibleCurrentSlotIconNames = [...possibleCurrentSlotIconNames];
                newPossibleCurrentSlotIconNames.push(iconName);
                possibleCurrentSlotIconNames = newPossibleCurrentSlotIconNames;

                // Don't increment max of this icon, because max might have been reduced on purpose!
                // const newMax = Math.min(numIconPossible + 1, maxIdenticalIconsInSolution);
                // setIconMinMax({iconIndex, max: newMax});
            }
            setPossibleIcons(possibleCurrentSlotIconNames, columnIndex);
        }
    }

    const isHighlighted = (iconName: string): boolean => {
        return possibleCurrentSlotIconNames.length === 1 && possibleCurrentSlotIconNames.includes(iconName);
    }

    const className = `slot-hint-column${possibleCurrentSlotIconNames.length === 0 ? ' no-selection-error' : ''}`.trim();

    return (
        <div className={className}>
            {iconCollectionNames.map((iconName: string) => {
                return (
                    <Drag
                    key={`${iconName}-drag`}
                    isActive={true}
                    dragPayloadObject={{iconName}}>
                        <Icon
                            key={iconName}
                            iconName={iconName}
                            isDisabled={disabledIcons.includes(iconName)}
                            isOpaque={!possibleCurrentSlotIconNames.includes(iconName)}
                            isOpacityToogleActive={true}
                            isHighlighted={isHighlighted(iconName)}
                            opacityToogleCallback={opacityToogleCallback}
                            selectColumnIconOnLongpress={columnIndex}
                        />
                    </Drag>
                );
            })}
        </div>
    );
};

export default SlotHintIconColumn;