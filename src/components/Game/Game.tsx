import { useState } from "react";
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
    const rowKeys = [...Array(numRows).keys()].map(i => i+1);

    const solutionColors = range(numPinsPerRow).map(i => {
        return baseColors[~~(Math.random()*baseColors.length -1)];
    })

    console.log(solutionColors);

    const defaultStartColorArray = range(numPinsPerRow).map(i => {
        return Color.makeHsl(0, 0, 0);
    })

    return <div>
        This is the game
        <div className="game">
            <div className="board">
                <GameRow
                    key={0}
                    rowKey={0}
                    colors={solutionColors}
                    solutionColors={solutionColors}
                />
                {rowKeys.reverse().map(rowKey => <GameRow
                    key={rowKey}
                    rowKey={rowKey}
                    colors={defaultStartColorArray}
                    solutionColors={solutionColors}
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