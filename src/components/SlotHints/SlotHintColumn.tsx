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

    const { disabledColorsDataString, possibleSlotColorsDataString } = useGameStore((state) => {
        const possibleSlotColorsDataString = state.hints.possibleSlotColorsDataStrings[columnIndex];
        const disabledColorsDataString = state.hints.disabledColorsDataString;
        return { disabledColorsDataString, possibleSlotColorsDataString };
    });

    const possibleSlotColors = Colors.deserialize(possibleSlotColorsDataString);

    const baseColors = Colors.deserialize(baseColorsDataString);
    const disabledColors = Colors.deserialize(disabledColorsDataString);

    return (
        <div className='slot-hint-column'>
            {baseColors.map((color: Color) => {
                return (
                    <ColorPin
                        key={color.hue}
                        color={color}
                        isDisabled={disabledColors.has(color)}
                        isOpacityToogleActive={true}
                        shouldReset={shouldReset}
                    />
                );
            })}
        </div>
    );
};

export default SlotHintColumn;