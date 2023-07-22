import { hslColorObject } from "../../interfaces/interfaces";
import useGameStore from "../../store/gameStore";
import Color from "../../util/Color";

import Colors from "../../util/Colors";
import ColorPin from "../ColorPin/ColorPin";
import DropTarget from "../DropTarget/DropTarget";

import './TuplesHintsRow.css';

interface tuplesHintsRowProps {
    rowIndex: number
}

const TuplesHintsRow = (props: tuplesHintsRowProps) => {
    const { rowIndex } = props;

    const { colorTuple, placeTupleColor } = useGameStore((state) => {
        const { hints, placeTupleColor } = state;
        const { colorTuplesDataStrings } = hints;
        const colorTuple = Colors.deserialize(colorTuplesDataStrings[rowIndex]);
        return { colorTuple, placeTupleColor };
    })

    const onColorDropped = (colorObject: hslColorObject, columnIndex: number) => {
        placeTupleColor({
            color: Color.makeFromHslObject(colorObject),
            rowIndex,
            columnIndex
        })
    }

    return (
        <div className="tuples-hints-row">
            {colorTuple.map((color: Color, columnIndex: number) => {
                return <DropTarget
                    key = {`${rowIndex}: ${columnIndex}`}
                    onItemDropped={(color: Color) => {
                        onColorDropped(color, columnIndex)
                }}>
                    <ColorPin
                        color={color}
                        key={columnIndex}
                    />
                </DropTarget>

            })}
        </div>
    );

}

export default TuplesHintsRow;