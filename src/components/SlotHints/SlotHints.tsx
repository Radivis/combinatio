import { colorsDataString } from '../../interfaces/types';
import { range } from '../../util/range';
import SlotHintColumn from './SlotHintColumn';

import './SlotHints.css';

interface slotHintsProps {
    numColumns: number;
    baseColorsDataString: colorsDataString
    shouldReset: boolean
}

const SlotHints = (props: slotHintsProps) => {
    const { numColumns, baseColorsDataString, shouldReset } = props;

    const columnArray = range(numColumns);

    return (
        <div className='slot-hints-container'>
            {columnArray.map(columnIndex => {
                return <SlotHintColumn
                    key={columnIndex}
                    baseColorsDataString={baseColorsDataString}
                    shouldReset={shouldReset}
                />
            })}
        </div>
    );
}

export default SlotHints;