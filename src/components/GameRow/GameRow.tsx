import { Dispatch, SetStateAction, } from "react";

import Color from "../../util/Color";
import ColorRow from "../ColorRow/ColorRow";
import InfoPins from "../InfoPins/InfoPins";
import { colorsDataString } from "../../interfaces/types";

import './GameRow.css';

interface gameRowProps {
    rowKey: number;
    numRows: number;
    numColumns: number;
    baseColorsDataString: colorsDataString;
    solutionColors: Color[];
    initialColors: Color[];
    activeRowIndex: number;
    setActiveRowIndex: Dispatch<SetStateAction<number>>;
    gameState: string;
    setGameState: Dispatch<SetStateAction<string>>;
    shouldClearBoard: boolean;
    setShouldClearBoard: Dispatch<SetStateAction<boolean>>;
}

const GameRow = (props: gameRowProps) => {
    const {
        rowKey,
        numColumns,
        activeRowIndex,
        shouldClearBoard,
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
            shouldClearBoard = {shouldClearBoard}
        />
    </div>
}

export default GameRow;
