import { useState, useEffect, useCallback } from "react";
import { numPinsPerRow, gameStates, holeHue, holeLightness, holeSaturation } from "../../constants";

import GameRow from "../GameRow/GameRow";
import SolutionRow from "../SolutionRow/SolutionRow";
import Color from "../../util/Color";
import Colors from "../../util/Colors";
import ColorBuckets from "../ColorBuckets/ColorBuckets";
import { range } from "../../util/range";

import './Game.css';
import { colorsDataString } from "../../interfaces/types";

interface gameProps {
    numColors: number;
    numRows: number;
    baseColorsDataString: colorsDataString;
}

// Idea: Game mode where a number of rows is automatically filled and evaluated

const Game = (props: gameProps) => {
    const { numRows, baseColorsDataString } = props;

    const baseColors: Colors = Colors.deserialize(baseColorsDataString);

    const holeColor = Color.makeHsl(holeHue, holeSaturation, holeLightness);

    const defaultStartColorArray = range(numPinsPerRow).map(i => {
        return holeColor;
    })

    const [activeRowIndex, setActiveRowIndex] = useState(1);
    const [solutionColors, setSolutionColors] = useState([...defaultStartColorArray]);
    const [gameState, setGameState] = useState(gameStates[0]);
    const [shouldClearBoard, setShouldClearBoard] = useState(false);
    
    const generateSolutionColors = useCallback((): Colors => {
        return new Colors(range(numPinsPerRow).map(i => {
            return baseColors[~~(Math.random()*baseColors.length -1)];
        }));
    }, [baseColors])
    
    const rowKeys = range(numRows+1, 1);

    const restartGame = () => {
        setGameState(gameStates[0]);
        setSolutionColors(generateSolutionColors());
        setActiveRowIndex(1);
        setShouldClearBoard(true);
    };

    // Generate the solutionColors in a useEffect, so that they don't change after each re-render!
    useEffect(() => {
        const _solutionColors = generateSolutionColors();
        setSolutionColors(_solutionColors);
    }, [baseColors, generateSolutionColors]);

    console.log('Game.tsx solution colors: ', solutionColors);

    return <div>
        {gameState === gameStates[0] && <h2>Game running</h2>}
        {gameState === gameStates[1] && <h2>Game won!</h2>}
        {gameState === gameStates[2] && <h2>Game lost!</h2>}
        <button onClick={restartGame}>
            Start new game
        </button>
        <div className="game">
            <div className="board">
                <SolutionRow
                    initialColors={defaultStartColorArray}
                    solutionColors={solutionColors}
                    gameState = {gameState}
                />
                {rowKeys.reverse().map(rowKey => <GameRow
                    key={rowKey}
                    rowKey={rowKey}
                    numRows={numRows}
                    baseColors={baseColors}
                    initialColors={defaultStartColorArray}
                    solutionColors={solutionColors}
                    activeRowIndex = {activeRowIndex}
                    setActiveRowIndex={setActiveRowIndex}
                    gameState = {gameState}
                    setGameState = {setGameState}
                    shouldClearBoard = {shouldClearBoard}
                    setShouldClearBoard = {setShouldClearBoard}
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