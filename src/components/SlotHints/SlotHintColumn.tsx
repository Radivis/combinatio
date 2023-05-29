import { colorsDataString } from '../../interfaces/types';
import Colors from '../../util/Colors';
import Color from '../../util/Color';
import ColorPin from '../ColorPin/ColorPin';

import './SlotHintColumn.css';

interface slotHintColumnProps {
    baseColorsDataString: colorsDataString
}

const SlotHintColumn = (props: slotHintColumnProps) => {
    const { baseColorsDataString } = props;

    const baseColors = Colors.deserialize(baseColorsDataString);

    return (
        <div className='slot-hint-column'>
            {baseColors.map((color: Color) => {
                return (
                    <ColorPin key={color.hue} color={color} isOpacityToogleActive={true}/>
                );
            })}
        </div>
    );
};

export default SlotHintColumn;