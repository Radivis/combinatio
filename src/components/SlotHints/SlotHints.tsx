import { pieceTypes } from '../../constants';
import { colorsDataString } from '../../interfaces/types';
import useGameStore from '../../store/gameStore';
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
    const { pieceType } = useGameStore((store) => {
        const { pieceType } = store.gameSettings;
        return { pieceType };
    })

    const { numColumns, baseColorsDataString } = props;

    const columnArray = range(numColumns);

    return (
        <div className='slot-hints-outer-container'>
            {(pieceType === pieceTypes.colorIcon || pieceType === pieceTypes.color) && (
                <>
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
                </>
            )}
            {(pieceType === pieceTypes.colorIcon || pieceType === pieceTypes.icon) && (
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