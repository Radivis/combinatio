import ColorRow from "../ColorRow/ColorRow";
import InfoPins from "../InfoPins/InfoPins";

import './GameRow.css';

interface gameRowProps {
    rowKey: number;
    numColumns: number;
    activeRowIndex: number;
}

const GameRow = (props: gameRowProps) => {
    const {
        rowKey,
        numColumns,
        activeRowIndex,
    } = props;

    return <div className="game-row">
        {rowKey}
        <ColorRow
            rowKey = {rowKey}
            numColumns = {numColumns}
            isActiveRow = {activeRowIndex === rowKey}
        />
        <InfoPins
            rowKey = {rowKey}
            isActiveRow = {activeRowIndex === rowKey}
        />
    </div>
}

export default GameRow;
