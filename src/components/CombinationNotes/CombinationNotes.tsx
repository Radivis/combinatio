import useGameStore from '../../store/gameStore';
import CombinationNotesRow from './CombinationNotesRow';

import './CombinationNotes.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const CombinationNotes = () => {

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
        <div className='combination-notes-container'>
        {(areCombinationNotesActive === true) &&
            <>
                <h3 className='combination-notes-title'>
                    Combination Notes
                </h3>
                {combinationNotes.map((combinationNote: [string, string], rowIndex: number) => {
                    return <CombinationNotesRow 
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

export default CombinationNotes;