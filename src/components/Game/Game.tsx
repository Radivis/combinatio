import { useState, useEffect, useCallback, } from "react";
import { gameStates, holeHue, holeLightness, holeSaturation } from "../../constants";

import GameRow from "../GameRow/GameRow";
import SolutionRow from "../SolutionRow/SolutionRow";
import Color from "../../util/Color";
import Colors from "../../util/Colors";
import ColorBuckets from "../ColorBuckets/ColorBuckets";
import SlotHints from "../SlotHints/SlotHints";
import Timer from "../Timer/Timer";
import { range } from "../../util/range";

import './Game.css';
import { colorsDataString } from "../../interfaces/types";

interface gameProps {
    numColors: number;
    numRows: number;
    numColumns: number;
    maxIdenticalColorsInSolution: number;
    baseColorsDataString: colorsDataString;
    areColorAmountHintsActive: boolean;
    areSlotHintsActive: boolean;
}

const Game = (props: gameProps) => {
    const {
        numRows,
        numColumns,
        maxIdenticalColorsInSolution,
        baseColorsDataString,
        areColorAmountHintsActive,
        areSlotHintsActive
    } = props;

    const holeColor = Color.makeHsl(holeHue, holeSaturation, holeLightness);

    const defaultStartColorArray: Color[] = range(numColumns).map(i => {
        return holeColor;
    })

    const [activeRowIndex, setActiveRowIndex] = useState<number>(1);
    const [solutionColors, setSolutionColors] = useState([...defaultStartColorArray]);
    const [gameState, setGameState] = useState(gameStates[0]);
    const [shouldClearBoard, setShouldClearBoard] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    
    const generateSolutionColors = useCallback((): Colors => {
        const baseColors: Colors = Colors.deserialize(baseColorsDataString);
        const solutionColors: Color[] = [];
        // Implicit assumption: All colors have different hues!
        const colorHueCountPairs = baseColors.map((color: Color) => [color.hue, maxIdenticalColorsInSolution]);
        console.log('colorHueCountPairs', colorHueCountPairs);
        let slotsLeft = numColumns;
        while (slotsLeft > 0) {
            const randomColorHueCountPair = colorHueCountPairs[~~(Math.random()*(colorHueCountPairs.length))];
            console.log('randomColorHueCountPair', randomColorHueCountPair);
            // Decrement the count of the chosen color
            randomColorHueCountPair[1] -= 1;
            // If the count has reached zero, remove the pair from the array
            if (randomColorHueCountPair[1] === 0) {
                const pairIndex = colorHueCountPairs.indexOf(randomColorHueCountPair);
                colorHueCountPairs.splice(pairIndex, 1);
            }
            console.log('colorHueCountPairs after reduction', colorHueCountPairs);
            // Add the chosen color to the solution and decrement the slot counter
            const solutionColor = baseColors.find((color: Color) => color.hue === randomColorHueCountPair[0]);
            if (solutionColor !== undefined) {
                solutionColors.push(solutionColor);
                slotsLeft--;
            }
        }
        return new Colors(solutionColors);
    }, [baseColorsDataString, numColumns, maxIdenticalColorsInSolution])
    
    const rowKeys = range(numRows+1, 1);

    const restartGame = () => {
        setGameState(gameStates[0]);
        setSolutionColors(generateSolutionColors());
        setActiveRowIndex(1);
        setShouldClearBoard(true);
        setTimerSeconds(0);
    };

    // Generate the solutionColors in a useEffect, so that they don't change after each re-render!
    useEffect(() => {
        const _solutionColors = generateSolutionColors();
        setSolutionColors(_solutionColors);
    }, [baseColorsDataString, generateSolutionColors]);

    useEffect(() => {
        // Start game timer
        const timer = setInterval(() => {
            setTimerSeconds((prevTimerSeconds) => prevTimerSeconds + 1)
        }, 1000);
        // Stop timer once the game has finished
        if (gameState !== gameStates[1]) clearInterval(timer);
        // Clear the timer
        return () => clearInterval(timer);
    }, [gameState]);

    console.log('Game.tsx solution colors: ', solutionColors);

    return <div>
        {gameState === gameStates[0] && <h2>Game waiting</h2>}
        {gameState === gameStates[1] && <h2>Game running</h2>}
        {gameState === gameStates[2] && <h2>Game won!</h2>}
        {gameState === gameStates[3] && <h2>Game lost!</h2>}
        <button onClick={restartGame}>
            Start new game
        </button>
        <div className="game">
            <div className="board">
                <SolutionRow
                    numColumns={numColumns}
                    initialColors={defaultStartColorArray}
                    solutionColors={solutionColors}
                    gameState = {gameState}
                />
                {rowKeys.reverse().map(rowKey => <GameRow
                    key={rowKey}
                    rowKey={rowKey}
                    numRows={numRows}
                    numColumns={numColumns}
                    baseColorsDataString={baseColorsDataString}
                    initialColors={defaultStartColorArray}
                    solutionColors={solutionColors}
                    activeRowIndex = {activeRowIndex}
                    setActiveRowIndex={setActiveRowIndex}
                    gameState = {gameState}
                    setGameState = {setGameState}
                    shouldClearBoard = {shouldClearBoard}
                    setShouldClearBoard = {setShouldClearBoard}
                />)}
                {areSlotHintsActive && <SlotHints
                    numColumns={numColumns}
                    baseColorsDataString={baseColorsDataString}
                    shouldReset = { shouldClearBoard }
                />}
            </div>
            <div className="side-panel">
                <div>
                    <Timer seconds={timerSeconds} />
                </div>
                <div>
                    <ColorBuckets
                        numColumns={numColumns}
                        baseColorsDataString={baseColorsDataString}
                        areColorAmountHintsActive={areColorAmountHintsActive}
                        shouldReset={ shouldClearBoard }
                    />
                </div>
            </div>

        </div>
    </div>
}

export default Game;