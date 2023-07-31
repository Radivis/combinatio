import { useState, useEffect, } from "react";
import { gameStates, holeHue, holeLightness, holeSaturation, pieceTypes } from "../../constants";

import GameRow from "../GameRow/GameRow";
import SolutionRow from "../SolutionRow/SolutionRow";
import Color from "../../util/Color";
import Colors from "../../util/Colors";
import ColorBuckets from "../ColorBuckets/ColorBuckets";
import SlotHints from "../SlotHints/SlotHints";
import Timer from "../Timer/Timer";
import { range } from "../../util/range";
import useGameStore from "../../store/gameStore";

import './Game.css';
import CombinationNotes from "../CombinationNotes/CombinationNotes";
import IconBuckets from "../IconBuckets/IconBuckets";

interface gameProps {
}

const Game = (props: gameProps) => {
    const [
        areColorAmountHintsActive,
        areSlotHintsActive,
        numColumns,
        numRows,
        maxIdenticalColorsInSolution,
        paletteColorsDataString,
    ] = useGameStore((state) => {
        const {
            areColorAmountHintsActive,
            areSlotHintsActive,
        } = state.displaySettings;
        const {
            maxIdenticalColorsInSolution,
            numColumns,
            numRows,
        } = state.gameSettings;
        const { paletteColorsDataString } = state.game;
        return [
            areColorAmountHintsActive,
            areSlotHintsActive,
            numColumns,
            numRows,
            maxIdenticalColorsInSolution,
            paletteColorsDataString,
        ];
    })

    const holeColor = Color.makeHsl(holeHue, holeSaturation, holeLightness);

    const defaultStartColorArray: Color[] = range(numColumns).map(i => {
        return holeColor;
    })

    const { activeRowIndex, solutionColorsDataString, gameState, pieceType, reset } = useGameStore((state) => {
        const { pieceType } = state.gameSettings;
        const { activeRowIndex, solutionColorsDataString, gameState } = state.game;
        const { reset } = state;
        return { activeRowIndex, solutionColorsDataString, gameState, pieceType, reset };
    })

    const solutionColors = Colors.deserialize(solutionColorsDataString);
    const [timerSeconds, setTimerSeconds] = useState(0);
    
    const rowKeys = range(numRows+1, 1);
    
    useEffect(() => {
        // Start game timer
        const timer = setInterval(() => {
            setTimerSeconds((prevTimerSeconds) => prevTimerSeconds + 1)
        }, 1000);
        // Stop timer once the game has finished
        if (gameState !== gameStates[1]) {
            clearInterval(timer);
        }
        if (gameState === gameStates[0]) {
            // Reset time to zero, if game state is "starting"
            setTimerSeconds(0);
        }
        // Clear the timer
        return () => clearInterval(timer);
    }, [gameState]);

    return <div>
        {gameState === gameStates[0] && <h2>Game waiting</h2>}
        {gameState === gameStates[1] && <h2>Game running</h2>}
        {gameState === gameStates[2] && <h2>Game won!</h2>}
        {gameState === gameStates[3] && <h2>Game lost!</h2>}
        <button onClick={reset}>
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
                    rowIndex={rowKey}
                    numColumns={numColumns}
                    activeRowIndex = {activeRowIndex}
                />)}
                {areSlotHintsActive && <SlotHints
                    numColumns={numColumns}
                    baseColorsDataString={paletteColorsDataString}
                />}
            </div>
            <div className="side-panel">
                <div>
                    <Timer seconds={timerSeconds} />
                </div>
                <div>
                    <ColorBuckets
                        numColumns={numColumns}
                        maxIdenticalColorsInSolution={maxIdenticalColorsInSolution}
                        baseColorsDataString={paletteColorsDataString}
                        areColorAmountHintsActive={areColorAmountHintsActive}
                    />
                    {pieceType === pieceTypes.colorIcon && 
                        <IconBuckets />
                    }
                    <CombinationNotes />
                </div>
            </div>

        </div>
    </div>
}

export default Game;