import { range } from '../../util/range';

import './InfoPins.css';


interface infoPinsProps {
    rowKey: number;
    numColumns: number;
    onSubmitRow: () => void;
    isActiveRow: boolean;
    numCorrectColor: number;
    numFullyCorrect: number;
    shouldClearBoard: boolean;
};

const InfoPins = (props: infoPinsProps) => {
    const {
        rowKey,
        numColumns,
        onSubmitRow,
        isActiveRow,
        numCorrectColor,
        numFullyCorrect,
        shouldClearBoard
    } = props;

    const pinClasses: string[] = new Array(numColumns).fill('info-pin');

    const numWhite = numCorrectColor - numFullyCorrect;

    pinClasses.forEach((_pinClass: string, columnIndex: number) => {
        if (numWhite > columnIndex && shouldClearBoard === false) pinClasses[columnIndex] += ' white';
        else if (numCorrectColor > columnIndex && shouldClearBoard === false) pinClasses[columnIndex] += ' black';
        else pinClasses[columnIndex] += ' hole';
    });

    // The width of the into pin container is natively determined by the width of the row submit-button
    // Instead, compute it according to numColumns / 2

    const infoPinBlockWidth = 18;

    const infoPinContainerWidth = Math.max(Math.ceil(numColumns / 2) * infoPinBlockWidth, infoPinBlockWidth * 2);

    return (
        <div key={rowKey} className='info-pins-container' style={{width: infoPinContainerWidth}}>
            {
                (isActiveRow === true) ? (
                    <button key={rowKey} className="submit-button" type="button" onClick={onSubmitRow}>
                        ?
                    </button>
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