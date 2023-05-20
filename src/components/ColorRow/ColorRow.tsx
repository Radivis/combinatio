import { useState } from "react";

import ColorPin from "../ColorPin/ColorPin";
import Color from "../../util/Color";
import DropTarget from "../DropTarget/DropTarget";
import { numPinsPerRow } from "../../constants";
import { hslColorObject } from "../../interfaces";

import './ColorRow.css';

interface colorRowProps {
    initialColors: Color[];
}

const ColorRow = (props: colorRowProps) => {
    const { initialColors } = props;

    const [currentColors, setCurrentColors] = useState(initialColors);

    const onColorDropped = (colorObject: hslColorObject, index: number) => {
        const newColors = [...currentColors];
        newColors[index] = Color.makeFromHslObject(colorObject);
        setCurrentColors(newColors);
    }

    return <div className='colorRow'>
        {[...Array(numPinsPerRow).keys()].map((i: number) =>
        { return <DropTarget onItemDropped={(color: Color) => onColorDropped(color, i)}>
            <ColorPin
                key = {i}
                color = {currentColors[i]}
            />
            </DropTarget>
        })}
    </div>
}

export default ColorRow;