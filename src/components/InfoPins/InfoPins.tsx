import { numPinsPerRow } from '../../constants';
import { range } from '../../util/range';

import './InfoPins.css';


interface infoPinsProps {
    rowKey: number;
    onSubmitRow: () => void;
    isActiveRow: boolean;
    numCorrectColor: number;
    numFullyCorrect: number;
    shouldClearBoard: boolean;
};

const InfoPins = (props: infoPinsProps) => {
    const { rowKey, onSubmitRow, isActiveRow, numCorrectColor, numFullyCorrect, shouldClearBoard } = props;

    const pinClasses: string[] = new Array(numPinsPerRow).fill('info-pin');

    pinClasses.forEach((_pinClass: string, index: number) => {
        if (numFullyCorrect > index && shouldClearBoard === false) pinClasses[index] += ' black';
        else if (numCorrectColor > index && shouldClearBoard === false) pinClasses[index] += ' white';
        else pinClasses[index] += ' grey';
    });

    return (
        <div key={rowKey}>
            {
                (isActiveRow === true) ? (
                    <button key={rowKey} className="submit-button" type="button" onClick={onSubmitRow}>
                        ?
                    </button>
                ) : (
                    <div key={rowKey} className="info-pins">
                        <div key={`${rowKey}: 3`} className={pinClasses[3]}></div>
                        <div key={`${rowKey}: 2`} className={pinClasses[2]}></div>
                        <div key={`${rowKey}: 1`} className={pinClasses[1]}></div>
                        <div key={`${rowKey}: 0`} className={pinClasses[0]}></div>
                    </div>
                )
            }
        </div>
    );
}

export default InfoPins;