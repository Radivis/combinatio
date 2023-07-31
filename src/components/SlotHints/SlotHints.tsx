import { colorsDataString } from '../../interfaces/types';
import { range } from '../../util/range';
import SlotHintColorColumn from './SlotHintColorColumn';
import SlotHintIconColumn from './SlotHintIconColumn';

import './SlotHints.css';

interface slotHintsProps {
    numColumns: number;
    baseColorsDataString: colorsDataString;
    iconCollectionNames: string[];
}

const SlotHints = (props: slotHintsProps) => {
    const { numColumns, baseColorsDataString, iconCollectionNames } = props;

    const columnArray = range(numColumns);

    return (
        <div className='slot-hints-outer-container'>
            <h3 className='slot-hints-title'>
                Possible Colors per Slot
            </h3>
            <div className='slot-hints-container'>
                {columnArray.map(columnIndex => {
                    return <SlotHintColorColumn
                        key={columnIndex}
                        columnIndex={columnIndex}
                        baseColorsDataString={baseColorsDataString}
                    />
                })}
            </div>
            {iconCollectionNames[0] !== '' && (
                <>                
                    <h3 className='slot-hints-title'>
                        Possible Icons per Slot
                    </h3>
                    <div className='slot-hints-container'>
                        {columnArray.map(columnIndex => {
                            return <SlotHintIconColumn
                                key={columnIndex}
                                columnIndex={columnIndex}
                            />
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

export default SlotHints;