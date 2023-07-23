import useGameStore from '../../store/gameStore';
import TuplesHintsRow from './TuplesHintsRow';

import './TuplesHints.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const TuplesHints = () => {

    const {
        areCombinationNotesActive,
        combinationNotes,
        addColorTuple
    } = useGameStore((state) => {
        const { hints, addColorTuple } = state;
        const { areCombinationNotesActive } = state.displaySettings;
        const { combinationNotes } = hints;
        return {
            areCombinationNotesActive,
            combinationNotes,
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
                {combinationNotes.map((combinationNote: [string, string], rowIndex: number) => {
                    return <TuplesHintsRow 
                        rowIndex={rowIndex}
                        key={rowIndex}
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