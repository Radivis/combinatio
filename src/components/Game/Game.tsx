import { useState, useEffect, useCallback } from "react";
import { numPinsPerRow, gameStates } from "../../constants";

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
        return Color.makeHsl(30, 25, 25);
    })

    
    const [activeRowIndex, setActiveRowIndex] = useState(1);
    const [solutionColors, setSolutionColors] = useState([...defaultStartColorArray]);
    const [gameState, setGameState] = useState(gameStates[0]);
    const [shouldClearBoard, setShouldClearBoard] = useState(false);
    
    const generateSolutionColors = useCallback((): Color[] => {
        return range(numPinsPerRow).map(i => {
            return baseColors[~~(Math.random()*baseColors.length -1)];
        });
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
                <GameRow
                    key={0}
                    rowKey={0}
                    numRows={numRows}
                    baseColors={baseColors}
                    initialColors={defaultStartColorArray}
                    solutionColors={solutionColors}
                    activeRowIndex = {activeRowIndex}
                    setActiveRowIndex = {setActiveRowIndex}
                    gameState = {gameState}
                    setGameState = {setGameState}
                    shouldClearBoard = {shouldClearBoard}
                    setShouldClearBoard = {setShouldClearBoard}
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