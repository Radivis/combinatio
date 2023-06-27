import { colorsDataString } from '../../interfaces/types';
import Colors from '../../util/Colors';
import Color from '../../util/Color';
import ColorPin from '../ColorPin/ColorPin';

import './SlotHintColumn.css';
import useGameStore from '../../store/gameStore';

interface slotHintColumnProps {
    baseColorsDataString: colorsDataString
    columnIndex: number,
    shouldReset: boolean
}

const SlotHintColumn = (props: slotHintColumnProps) => {
    const { baseColorsDataString, columnIndex, shouldReset } = props;

    const { disabledColorsDataString, possibleSlotColorsDataString, setPossibleColors } = useGameStore((state) => {
        const possibleSlotColorsDataString = state.hints.possibleSlotColorsDataStrings[columnIndex];
        const disabledColorsDataString = state.hints.disabledColorsDataString;
        const { setPossibleColors } = state;
        return { disabledColorsDataString, possibleSlotColorsDataString, setPossibleColors };
    });

    let possibleSlotColors = Colors.deserialize(possibleSlotColorsDataString);
    const baseColors = Colors.deserialize(baseColorsDataString);
    const disabledColors = Colors.deserialize(disabledColorsDataString);

    const opacityToogleCallback = (color: Color) => {
        if (possibleSlotColors.has(color)) {
            // Color was possible, must now be removed from possible colors
            possibleSlotColors.remove(color);
        } else {
            // Color was impossible, must now be added to possible colors
            possibleSlotColors.add(color);
        }
        setPossibleColors(possibleSlotColors, columnIndex);
    }

    return (
        <div className='slot-hint-column'>
            {baseColors.map((color: Color) => {
                return (
                    <ColorPin
                        key={color.hue}
                        color={color}
                        isDisabled={disabledColors.has(color)}
                        isOpaque={!possibleSlotColors.has(color)}
                        isOpacityToogleActive={true}
                        opacityToogleCallback={opacityToogleCallback}
                        shouldReset={shouldReset}
                    />
                );
            })}
        </div>
    );
};

export default SlotHintColumn;