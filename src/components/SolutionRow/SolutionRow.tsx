import { useState, useEffect } from "react";

import Color from "../../util/Color";
import ColorRow from "../ColorRow/ColorRow";

import '../GameRow/GameRow.css';
import { gameStates } from "../../constants";

interface solutionRowProps {
    solutionColors: Color[];
    initialColors: Color[];
    gameState: string;
}

const SolutionRow = (props: solutionRowProps) => {
    const {
        initialColors,
        solutionColors,
        gameState,
    } = props;
    const copyOfInitialColors = [...initialColors].map(color => color.copy());
   
    const [ colors, setColors ] = useState([...copyOfInitialColors]);

    return <div className="game-row">
        <ColorRow
            rowKey = {0}
            initialColors = {colors}
            isActiveRow = {false}
            colors = {gameStates.slice(1,3).includes(gameState) ? solutionColors : colors}
            setColors = {setColors}
        />
    </div>
}

export default SolutionRow;
