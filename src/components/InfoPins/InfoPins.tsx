import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDice, faQuestion } from '@fortawesome/free-solid-svg-icons';

import useGameStore from '../../store/gameStore';

import './InfoPins.css';

const INFO_PIN_WIDTH = 18;
const BUTTON_WIDTH = 36;
const BUTTON_DISTANCE = 5;

interface infoPinsProps {
    rowKey: number;
    isActiveRow: boolean;
};

const InfoPins = (props: infoPinsProps) => {
    const {
        rowKey,
        isActiveRow,
    } = props;

    const {
        numColumns,
        isRandomGuessButtonDisplayed,
        numCorrectColor,
        numFullyCorrect,
        guess,
        randomGuess,
    } = useGameStore((state) => {
        const { guess, randomGuess } = state;
        const { isRandomGuessButtonDisplayed } = state.displaySettings;
        const { numColumns }= state.gameSettings;
        const { numCorrectColor, numFullyCorrect } = state.game.gameRows[rowKey];
        return {
            numColumns,
            isRandomGuessButtonDisplayed,
            numCorrectColor,
            numFullyCorrect,
            guess,
            randomGuess,
        };
    })

    const pinClasses: string[] = new Array(numColumns).fill('info-pin');

    const numWhite = numCorrectColor - numFullyCorrect;

    pinClasses.forEach((_pinClass: string, columnIndex: number) => {
        if (numWhite > columnIndex) pinClasses[columnIndex] += ' white';
        else if (numCorrectColor > columnIndex) pinClasses[columnIndex] += ' black';
        else pinClasses[columnIndex] += ' hole';
    });

    // The width of the into pin container is natively determined by the width of the row submit-button
    // Instead, compute it according to numColumns / 2

    const infoPinBlockWidth = INFO_PIN_WIDTH;

    const infoPinContainerWidth = Math.max(Math.ceil(numColumns / 2) * infoPinBlockWidth, infoPinBlockWidth * 2);

    // Two buttons and the space between those
    let buttonContainerWidth = BUTTON_DISTANCE;
    buttonContainerWidth += BUTTON_WIDTH;
    buttonContainerWidth += (isRandomGuessButtonDisplayed ? BUTTON_WIDTH : 0);

    const actualInfoPinContainerWidth = Math.max(infoPinContainerWidth, buttonContainerWidth);

    return (
        <div key={rowKey} className='info-pins-container' style={{width: actualInfoPinContainerWidth}}>
            {
                (isActiveRow === true) ? (
                    <div className="game-row-buttons">
                        {isRandomGuessButtonDisplayed && <button key={`${rowKey} random-button`} className="random-button" type="button" onClick={randomGuess}>
                            <FontAwesomeIcon icon={faDice} />
                        </button>}
                        <button key={`${rowKey} submit-button`} className="submit-button" type="button" onClick={guess}>
                            <FontAwesomeIcon icon={faQuestion} />
                        </button>
                    </div>
                ) : (
                    <div key={rowKey} className="info-pins">
                        {pinClasses.map((pinClass, columnIndex) => {
                            return <div key={`${rowKey}: ${columnIndex}`} className={pinClass}></div>
                        })}
                    </div>
                )
            }
        </div>
    );
}

export default InfoPins;