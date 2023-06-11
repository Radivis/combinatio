import useGameStore from '../../store/gameStore';

import './InfoPins.css';


interface infoPinsProps {
    rowKey: number;
    isActiveRow: boolean;
};

const InfoPins = (props: infoPinsProps) => {
    const {
        rowKey,
        isActiveRow,
    } = props;

    const { numColumns, numCorrectColor, numFullyCorrect, guess } = useGameStore((state) => {
        const { guess } = state;
        const { numColumns }= state.settings;
        const { numCorrectColor, numFullyCorrect } = state.game.gameRows[rowKey];
        return { numColumns, numCorrectColor, numFullyCorrect, guess };
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

    const infoPinBlockWidth = 18;

    const infoPinContainerWidth = Math.max(Math.ceil(numColumns / 2) * infoPinBlockWidth, infoPinBlockWidth * 2);

    return (
        <div key={rowKey} className='info-pins-container' style={{width: infoPinContainerWidth}}>
            {
                (isActiveRow === true) ? (
                    <button key={rowKey} className="submit-button" type="button" onClick={guess}>
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