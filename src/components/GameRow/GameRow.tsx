import ColorRow from "../ColorRow/ColorRow";
import InfoPins from "../InfoPins/InfoPins";

import './GameRow.css';

interface gameRowProps {
    rowIndex: number;
    numColumns: number;
    activeRowIndex: number;
}

const GameRow = (props: gameRowProps) => {
    const {
        rowIndex,
        numColumns,
        activeRowIndex,
    } = props;

    let gameRowContainerClassName = 'game-row '
    if (activeRowIndex === rowIndex) gameRowContainerClassName += 'highlighted ';
    gameRowContainerClassName.trim();

    return <div className={gameRowContainerClassName}>
        <div className="row-index-container">
            {rowIndex}
        </div>
        <ColorRow
            rowIndex = {rowIndex}
            numColumns = {numColumns}
            isActiveRow = {activeRowIndex === rowIndex}
        />
        <InfoPins
            rowKey = {rowIndex}
            isActiveRow = {activeRowIndex === rowIndex}
        />
    </div>
}

export default GameRow;
