import { Dispatch, SetStateAction, useState } from "react";

import Color from "../../util/Color";
import ColorRow from "../ColorRow/ColorRow";
import InfoPins from "../InfoPins/InfoPins";

import './GameRow.css';

interface gameRowProps {
    rowKey: number;
    baseColors: Color[];
    solutionColors: Color[];
    initialColors: Color[];
    activeRowIndex: number;
    setActiveRowIndex: Dispatch<SetStateAction<number>>;
}

const GameRow = (props: gameRowProps) => {
    const { rowKey, baseColors, initialColors, solutionColors, activeRowIndex, setActiveRowIndex } = props;

    const [ numCorrectColor, setNumCorrectColor ] = useState(0);
    const [ numFullyCorrect, setNumFullyCorrect ] = useState(0);
    const [ colors, setColors ] = useState(initialColors);

    const onSumbitRow = () => {
        console.log('colors', colors);
        console.log('solutionColors', solutionColors);

        // Compute number of fully correct pins
        let _numFullyCorrect = 0;
        colors.forEach((color, index) => {
            if (color.hasSameHue(solutionColors[index])) _numFullyCorrect++;
        })
        setNumFullyCorrect(_numFullyCorrect);
        
        console.log('_numFullyCorrect', _numFullyCorrect);
        
        // Compute number of correct colors
        // Problem: Working with sets doesn't work here, because a number can appear multiple times!
        // Idea: For each hue collect the number that it appears in a color Array
        // Then take the minimum of both numbers, the add all those up
        const hueCounts = Object.fromEntries(baseColors.map(color => [color.hue,0]));
        colors.forEach(color => {
            hueCounts[color.hue]++;
        })

        const solutionHueCounts = Object.fromEntries(baseColors.map(color => [color.hue,0]));
        solutionColors.forEach(solutionColor => {
            solutionHueCounts[solutionColor.hue]++;
        })

        const correctHueCounts = Object.fromEntries(baseColors.map(color => [color.hue,0]));
        baseColors.forEach(baseColor => {
            correctHueCounts[baseColor.hue] = Math.min(hueCounts[baseColor.hue], solutionHueCounts[baseColor.hue]);
        })

        const _numCorrectColor = Object.values(correctHueCounts).reduce((acc, next) => acc+next, 0);

        setNumCorrectColor(_numCorrectColor);
        
        console.log('hueCounts', hueCounts);
        console.log('solutionHueCounts', solutionHueCounts);
        console.log('correctHueCounts', correctHueCounts);
        console.log('_numCorrectColor', _numCorrectColor);
        setActiveRowIndex(activeRowIndex+1);
    }

    return <div className="game-row">
        {rowKey}
        <ColorRow
            initialColors = {colors}
            isActiveRow = {activeRowIndex === rowKey}
            colors = { colors }
            setColors = {setColors}
        />
        <InfoPins
            onSubmitRow={onSumbitRow}
            isActiveRow = {activeRowIndex === rowKey}
        />
    </div>
}

export default GameRow;
