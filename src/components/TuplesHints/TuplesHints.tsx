import useGameStore from '../../store/gameStore';
import TuplesHintsRow from './TuplesHintsRow';

import './TuplesHints.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const TuplesHints = () => {

    const { colorTuplesDataStrings, addColorTuple } = useGameStore((state) => {
        const { hints, addColorTuple } = state;
        const { colorTuplesDataStrings } = hints;
        return { colorTuplesDataStrings, addColorTuple };
    })

    return (
        <div className='tuples-hints-container'>
            {colorTuplesDataStrings.map((colorTuplesDataString: string, rowIndex: number) => {
                return <TuplesHintsRow 
                    rowIndex={rowIndex}
                />
            })}
            <button className='add-color-tuple-button' onClick={addColorTuple}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    );
}

export default TuplesHints;