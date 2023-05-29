import { useState } from "react";

import Color from "../../util/Color";
import ColorRow from "../ColorRow/ColorRow";

import '../GameRow/GameRow.css';
import './SolutionRow.css'
import { gameStates } from "../../constants";

interface solutionRowProps {
    numColumns: number;
    solutionColors: Color[];
    initialColors: Color[];
    gameState: string;
}

const SolutionRow = (props: solutionRowProps) => {
    const {
        numColumns,
        initialColors,
        solutionColors,
        gameState,
    } = props;
    const copyOfInitialColors = [...initialColors].map(color => color.copy());
   
    const [ colors, setColors ] = useState([...copyOfInitialColors]);

    return <div className="game-row solution-row">
        <ColorRow
            rowKey = {0}
            numColumns={numColumns}
            isActiveRow = {false}
            colors = {gameStates.slice(2,4).includes(gameState) ? solutionColors : colors}
            setColors = {setColors}
        />
    </div>
}

export default SolutionRow;
