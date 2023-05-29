import { colorsDataString } from '../../interfaces/types';
import Colors from '../../util/Colors';
import { range } from '../../util/range';
import { numPinsPerRow } from '../../constants';
import SlotHintColumn from './SlotHintColumn';

import './SlotHints.css';

interface slotHintsProps {
    baseColorsDataString: colorsDataString
}

const SlotHints = (props: slotHintsProps) => {
    const { baseColorsDataString } = props;

    const baseColors = Colors.deserialize(baseColorsDataString);

    const columnArray = range(numPinsPerRow);

    return (
        <div className='slot-hints-container'>
            {columnArray.map(columnIndex => {
                return <SlotHintColumn key={columnIndex} baseColorsDataString={baseColorsDataString}/>
            })}
        </div>
    );
}

export default SlotHints;