import { colorsDataString } from '../../interfaces/types';
import Colors from '../../util/Colors';
import Color from '../../util/Color';
import ColorPin from '../ColorPin/ColorPin';

import './SlotHintColumn.css';

interface slotHintColumnProps {
    baseColorsDataString: colorsDataString
    shouldReset: boolean
}

const SlotHintColumn = (props: slotHintColumnProps) => {
    const { baseColorsDataString, shouldReset } = props;

    const baseColors = Colors.deserialize(baseColorsDataString);

    return (
        <div className='slot-hint-column'>
            {baseColors.map((color: Color) => {
                return (
                    <ColorPin
                        key={color.hue}
                        color={color}
                        isOpacityToogleActive={true}
                        shouldReset={shouldReset}
                    />
                );
            })}
        </div>
    );
};

export default SlotHintColumn;