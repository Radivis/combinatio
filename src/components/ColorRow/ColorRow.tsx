import { useState } from "react";

import ColorPin from "../ColorPin/ColorPin";
import Color from "../../util/Color";
import DropTarget from "../DropTarget/DropTarget";
import { numPinsPerRow } from "../../constants";
import { hslColorObject } from "../../interfaces";

import './ColorRow.css';

interface colorRowProps {
    initialColors: Color[];
    isActiveRow: boolean;
    colors: Color[];
    setColors: Function;
}

const ColorRow = (props: colorRowProps) => {
    const { initialColors, isActiveRow, colors, setColors } = props;

    const onColorDropped = (colorObject: hslColorObject, index: number) => {
        const newColors = [...colors];
        newColors[index] = Color.makeFromHslObject(colorObject);
        setColors(newColors);
    }

    return <div className='colorRow'>
        {[...Array(numPinsPerRow).keys()].map((i: number) =>
        { return <DropTarget onItemDropped={(color: Color) => {if (isActiveRow) onColorDropped(color, i)}}>
            <ColorPin
                key = {i}
                color = {colors[i]}
            />
            </DropTarget>
        })}
    </div>
}

export default ColorRow;