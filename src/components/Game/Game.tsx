import { useState, useEffect } from "react";
import { numPinsPerRow } from "../../constants";

import GameRow from "../GameRow/GameRow";
import Color from "../../util/Color";
import ColorBuckets from "../ColorBuckets/ColorBuckets";
import { range } from "../../util/range";

import './Game.css';

interface gameProps {
    numColors: number;
    numRows: number;
    baseColors: Color[];
}

const Game = (props: gameProps) => {
    const { numRows, baseColors } = props;

    const defaultStartColorArray = range(numPinsPerRow).map(i => {
        return Color.makeHsl(0, 0, 0);
    })

    const [activeRowIndex, setActiveRowIndex] = useState(1);
    const [solutionColors, setSolutionColors] = useState(defaultStartColorArray);

    const rowKeys = range(numRows+1, 1);

    useEffect(() => {
        const _solutionColors = range(numPinsPerRow).map(i => {
            return baseColors[~~(Math.random()*baseColors.length -1)];
        });
        setSolutionColors(_solutionColors);
    }, [baseColors]);

    console.log('Game.tsx solution colors: ', solutionColors);

    return <div>
        This is the game
        <div className="game">
            <div className="board">
                <GameRow
                    key={0}
                    rowKey={0}
                    baseColors={baseColors}
                    initialColors={solutionColors}
                    solutionColors={solutionColors}
                    activeRowIndex = {activeRowIndex}
                    setActiveRowIndex = {setActiveRowIndex}
                />
                {rowKeys.reverse().map(rowKey => <GameRow
                    key={rowKey}
                    rowKey={rowKey}
                    baseColors={baseColors}
                    initialColors={defaultStartColorArray}
                    solutionColors={solutionColors}
                    activeRowIndex = {activeRowIndex}
                    setActiveRowIndex={setActiveRowIndex}
                />)}
            </div>
            <div className="side-panel">
                <div>
                    Timer
                </div>
                <div>
                    <ColorBuckets baseColors={baseColors} />
                </div>
            </div>

        </div>
    </div>
}

export default Game;