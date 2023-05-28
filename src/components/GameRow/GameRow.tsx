import { Dispatch, SetStateAction, useState, useEffect } from "react";

import Color from "../../util/Color";
import Colors from "../../util/Colors";
import ColorRow from "../ColorRow/ColorRow";
import InfoPins from "../InfoPins/InfoPins";
import { gameStates, numPinsPerRow } from "../../constants";
import { colorsDataString } from "../../interfaces/types";

import './GameRow.css';

interface gameRowProps {
    rowKey: number;
    numRows: number;
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
        numRows,
        baseColorsDataString,
        initialColors,
        solutionColors,
        activeRowIndex,
        setActiveRowIndex,
        setGameState,
        shouldClearBoard,
        setShouldClearBoard
    } = props;

    const baseColors: Colors = Colors.deserialize(baseColorsDataString);

    const copyOfInitialColors = [...initialColors].map(color => color.copy());

    const [ numCorrectColor, setNumCorrectColor ] = useState(0);
    const [ numFullyCorrect, setNumFullyCorrect ] = useState(0);
    const [ colors, setColors ] = useState([...copyOfInitialColors]);

    const onSumbitRow = () => {
        // Disable board clearing
        setShouldClearBoard(false);

        // Compute number of fully correct pins
        let _numFullyCorrect = 0;
        colors.forEach((color, index) => {
            if (color.hasSameHue(solutionColors[index])) _numFullyCorrect++;
        })
        setNumFullyCorrect(_numFullyCorrect);
        
        // Compute number of correct colors
        // For each hue collect the number that it appears in the colors Array
        const hueCounts = Object.fromEntries(baseColors.map(color => [color.hue,0]));
        colors.forEach(color => {
            hueCounts[color.hue]++;
        })

        // For each hue collect the number that it appears in the solutionColors Array
        const solutionHueCounts = Object.fromEntries(baseColors.map(color => [color.hue,0]));
        solutionColors.forEach(solutionColor => {
            solutionHueCounts[solutionColor.hue]++;
        })

        // Always take the minimum of both numbers
        const correctHueCounts = Object.fromEntries(baseColors.map(color => [color.hue,0]));
        baseColors.forEach(baseColor => {
            correctHueCounts[baseColor.hue] = Math.min(hueCounts[baseColor.hue], solutionHueCounts[baseColor.hue]);
        })

        // Add upp the number of correctly guess colors
        const _numCorrectColor = Object.values(correctHueCounts).reduce((acc, next) => acc+next, 0);

        setNumCorrectColor(_numCorrectColor);
        
        setActiveRowIndex(activeRowIndex+1);

        // Start game once submitting the first row
        if (activeRowIndex === 1) {
            setGameState(gameStates[1]);
            return;
        }

        // Check for victory condition
        if (_numFullyCorrect === numPinsPerRow) {
            setGameState(gameStates[2]);
            return;
        }

        // Check for running out of rows -> loss
        if (activeRowIndex === numRows) {
            setGameState(gameStates[3]);
            return;
        }
    }

    useEffect(() => {
        if (shouldClearBoard) {
            setColors([...initialColors]);
            setNumCorrectColor(0);
            setNumFullyCorrect(0);
        }
    }, [shouldClearBoard, initialColors]);

    return <div className="game-row">
        {rowKey}
        <ColorRow
            rowKey = {rowKey}
            isActiveRow = {activeRowIndex === rowKey}
            colors = { colors }
            setColors = {setColors}
        />
        <InfoPins
            rowKey = {rowKey}
            onSubmitRow={onSumbitRow}
            isActiveRow = {activeRowIndex === rowKey}
            numCorrectColor = {shouldClearBoard === false ? numCorrectColor : 0}
            numFullyCorrect = {shouldClearBoard === false ? numFullyCorrect : 0}
            shouldClearBoard = {shouldClearBoard}
        />
    </div>
}

export default GameRow;
