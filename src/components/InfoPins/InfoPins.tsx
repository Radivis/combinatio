import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDice, faQuestion } from '@fortawesome/free-solid-svg-icons';

import useGameStore from '../../store/gameStore';

import './InfoPins.css';
import { pieceTypes } from '../../constants';

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
        infoPinStatusCounts,
        numCorrectColor,
        numFullyCorrect,
        pieceType,
        guess,
        randomGuess,
    } = useGameStore((state) => {
        const { guess, randomGuess } = state;
        const { isRandomGuessButtonDisplayed } = state.displaySettings;
        const { numColumns, pieceType }= state.gameSettings;
        const { numCorrectColor, numFullyCorrect, infoPinStatusCounts } = state.game.gameRows[rowKey];
        return {
            numColumns,
            isRandomGuessButtonDisplayed,
            infoPinStatusCounts,
            numCorrectColor,
            numFullyCorrect,
            pieceType,
            guess,
            randomGuess,
        };
    })

    const pinClasses: string[] = new Array(numColumns).fill('info-pin');

    // Not-readonly copy of infoPinStatusCounts
    const _infoPinStatusCounts = {...infoPinStatusCounts};

    // Consumes the counts from the infoPinStatusCounts object and returns the next pin class string
    const nextPinClass = (): string => {
        if (_infoPinStatusCounts['numFullyCorrect'] > 0) {
            _infoPinStatusCounts['numFullyCorrect']--;
            return ' black';
        } else if (_infoPinStatusCounts['numColorIconPresentColorCorrect'] > 0) {
            _infoPinStatusCounts['numColorIconPresentColorCorrect']--;
            return ' black-grey';
        } else if (_infoPinStatusCounts['numColorIconPresentIconCorrect'] > 0) {
            _infoPinStatusCounts['numColorIconPresentIconCorrect']--;
            return ' grey-black';
        } else if (_infoPinStatusCounts['numColorCorrectIconPresent'] > 0) {
            _infoPinStatusCounts['numColorCorrectIconPresent']--;
            return ' black-white';
        } else if (_infoPinStatusCounts['numIconCorrectColorPresent'] > 0) {
            _infoPinStatusCounts['numIconCorrectColorPresent']--;
            return ' white-black';
        } else if (_infoPinStatusCounts['numColorCorrectIconAmiss'] > 0) {
            _infoPinStatusCounts['numColorCorrectIconAmiss']--;
            return ' black-rim';
        } else if (_infoPinStatusCounts['numIconCorrectColorAmiss'] > 0) {
            _infoPinStatusCounts['numIconCorrectColorAmiss']--;
            return ' black-core';
        } else if (_infoPinStatusCounts['numColorIconPresent'] > 0) {
            _infoPinStatusCounts['numColorIconPresent']--;
            return ' grey';
        } else if (_infoPinStatusCounts['numColorPresentIconPresent'] > 0) {
            _infoPinStatusCounts['numColorPresentIconPresent']--;
            return ' white';
        } else if (_infoPinStatusCounts['numColorPresentIconAmiss'] > 0) {
            _infoPinStatusCounts['numColorPresentIconAmiss']--;
            return ' white-rim';
        } else if (_infoPinStatusCounts['numIconPresentColorAmiss'] > 0) {
            _infoPinStatusCounts['numIconPresentColorAmiss']--;
            return ' white-core';
        } else if (_infoPinStatusCounts['numAllAmiss'] > 0) {
            _infoPinStatusCounts['numAllAmiss']--;
            return ' hole';
        } else {
            return ' hole';
        }
    }

    if (pieceType === pieceTypes.color || pieceType === pieceTypes.icon) {
        const numWhite = numCorrectColor - numFullyCorrect;
    
        pinClasses.forEach((_pinClass: string, columnIndex: number) => {
            if (numWhite > columnIndex) pinClasses[columnIndex] += ' white';
            else if (numCorrectColor > columnIndex) pinClasses[columnIndex] += ' black';
            else pinClasses[columnIndex] += ' hole';
        });
    } else if (pieceType === pieceTypes.colorIcon) {
        pinClasses.forEach((_pinClass: string, columnIndex: number) => {
            pinClasses[columnIndex] += nextPinClass();
        });
    }


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