import ColorPin from "../ColorPin/ColorPin";
import Color from "../../util/Color";
import DropTarget from "../DropTarget/DropTarget";
import { hslColorObject } from "../../interfaces/interfaces";

import './ColorRow.css';

interface colorRowProps {
    rowKey: number;
    numColumns: number;
    isActiveRow: boolean;
    colors: Color[];
    setColors: Function;
}

const ColorRow = (props: colorRowProps) => {
    const { rowKey, numColumns, isActiveRow, colors, setColors } = props;

    const onColorDropped = (colorObject: hslColorObject, index: number) => {
        const newColors = [...colors];
        newColors[index] = Color.makeFromHslObject(colorObject);
        setColors(newColors);
    }

    return <div className='colorRow'>
        {[...Array(numColumns).keys()].map((i: number) =>
        { return <DropTarget key = {`${rowKey}: ${i}`} onItemDropped={(color: Color) => {if (isActiveRow) onColorDropped(color, i)}}>
            <ColorPin
                key = {`${rowKey}: ${i}`}
                color = {colors[i]}
            />
            </DropTarget>
        })}
    </div>
}

export default ColorRow;