import useGameStore from '../../store/gameStore';
import TuplesHintsRow from './TuplesHintsRow';

import './TuplesHints.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const TuplesHints = () => {

    const {
        areCombinationNotesActive,
        colorTuplesDataStrings,
        addColorTuple
    } = useGameStore((state) => {
        const { hints, addColorTuple } = state;
        const { areCombinationNotesActive } = state.settings;
        const { colorTuplesDataStrings } = hints;
        return {
            areCombinationNotesActive,
            colorTuplesDataStrings,
            addColorTuple
        };
    })

    return (
        <div className='tuples-hints-container'>
        {(areCombinationNotesActive === true) &&
            <>
                <h3 className='tuples-hints-title'>
                    Combination Notes
                </h3>
                {colorTuplesDataStrings.map((colorTuplesDataString: string, rowIndex: number) => {
                    return <TuplesHintsRow 
                        rowIndex={rowIndex}
                    />
                })}
                <button className='add-color-tuple-button' onClick={addColorTuple}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </>}
        </div>
    );
}

export default TuplesHints;