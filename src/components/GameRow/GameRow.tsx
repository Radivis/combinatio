import { Dispatch, SetStateAction, useState, useReducer } from "react";

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

    // console.log(`GameRow ${rowKey} initialColors: `, initialColors);

    const copyOfInitialColors = [...initialColors].map(color => color.clone());

    // console.log(`GameRow ${rowKey} copy of initialColors: `, copyOfInitialColors);

    const [ numCorrectColor, setNumCorrectColor ] = useState(0);
    const [ numFullyCorrect, setNumFullyCorrect ] = useState(0);
    const [ colors, setColors ] = useState([...copyOfInitialColors]);

    // console.log(`GameRow ${rowKey} colors: `, colors);

    const onSumbitRow = () => {
        console.log('colors', colors);
        console.log('solutionColors', solutionColors);

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
    }

    return <div className="game-row">
        {rowKey}
        <ColorRow
            rowKey = {rowKey}
            initialColors = {colors}
            isActiveRow = {activeRowIndex === rowKey}
            colors = { colors }
            setColors = {setColors}
        />
        <InfoPins
            rowKey = {rowKey}
            onSubmitRow={onSumbitRow}
            isActiveRow = {activeRowIndex === rowKey}
            numCorrectColor = {numCorrectColor}
            numFullyCorrect = {numFullyCorrect}
        />
    </div>
}

export default GameRow;
