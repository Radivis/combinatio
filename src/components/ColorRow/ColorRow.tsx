import ColorPin from "../ColorPin/ColorPin";
import Color from "../../util/Color";
import Colors from "../../util/Colors";
import DropTarget from "../DropTarget/DropTarget";
import { hslColorObject } from "../../interfaces/interfaces";
import { gameStates } from "../../constants";

import './ColorRow.css';
import useGameStore from "../../store/gameStore";

interface colorRowProps {
    rowKey: number;
    numColumns: number;
    isActiveRow: boolean;
}

const ColorRow = (props: colorRowProps) => {
    const { rowKey, numColumns, isActiveRow } = props;

    const {
        gameState,
        rowColorsDataString,
        solutionColorsDataString,
        placeColor
    } = useGameStore((state) => {
        const { placeColor } = state;
        const { gameState, solutionColorsDataString } = state.game;
        const { rowColorsDataString } = state.game.gameRows[rowKey];
        return { gameState, rowColorsDataString, solutionColorsDataString, placeColor };
    })

    let rowColors = Colors.deserialize(rowColorsDataString);
    if (rowKey === 0
        && gameStates.slice(2,4).includes(gameState)) {
            rowColors = Colors.deserialize(solutionColorsDataString);
        }

    const onColorDropped = (colorObject: hslColorObject, columnIndex: number) => {
        placeColor({
            color: Color.makeFromHslObject(colorObject),
            row: rowKey,
            column: columnIndex
        })
    }

    return <div className='colorRow'>
        {[...Array(numColumns).keys()].map((i: number) =>
        { return (
            <DropTarget
                key = {`${rowKey}: ${i}`}
                onItemDropped={(color: Color) => {
                    if (isActiveRow) onColorDropped(color, i)
                }}>
                <ColorPin
                    key = {`${rowKey}: ${i}`}
                    color = {rowColors[i]}
                />
            </DropTarget>
        )})
        }
    </div>
}

export default ColorRow;