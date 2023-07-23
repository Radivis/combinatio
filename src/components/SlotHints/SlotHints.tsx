import { colorsDataString } from '../../interfaces/types';
import { range } from '../../util/range';
import SlotHintColumn from './SlotHintColumn';

import './SlotHints.css';

interface slotHintsProps {
    numColumns: number;
    baseColorsDataString: colorsDataString
}

const SlotHints = (props: slotHintsProps) => {
    const { numColumns, baseColorsDataString } = props;

    const columnArray = range(numColumns);

    return (
        <div className='slot-hints-outer-container'>
            <h3 className='slot-hints-title'>
                Possible Colors per Slot
            </h3>
            <div className='slot-hints-container'>
                {columnArray.map(columnIndex => {
                    return <SlotHintColumn
                        key={columnIndex}
                        columnIndex={columnIndex}
                        baseColorsDataString={baseColorsDataString}
                    />
                })}
            </div>
        </div>
    );
}

export default SlotHints;