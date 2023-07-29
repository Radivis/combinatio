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
        placeColor,
        placeIcon,
    } = useGameStore((state) => {
        const { placeColor, placeIcon } = state;
        const { gameState, solutionColorsDataString } = state.game;
        const { rowColorsDataString } = state.game.gameRows[rowKey];
        return { gameState, rowColorsDataString, solutionColorsDataString, placeColor, placeIcon };
    })

    let rowColors = Colors.deserialize(rowColorsDataString);
    if (rowKey === 0
        && gameStates.slice(2,4).includes(gameState)) {
            rowColors = Colors.deserialize(solutionColorsDataString);
        }

    const onPieceDropped = (payload: object, columnIndex: number) => {
        console.log('onPieceDropped', 'payload', payload);
        if ('iconName' in payload && typeof payload['iconName'] === 'string') {
            // Icon is encoded via iconName
            const { iconName } = payload;
            placeIcon({
                iconName,
                row: rowKey,
                column: columnIndex
            })
        } else {
            // Color is encoded via hslColorObject
            placeColor({
                color: Color.makeFromHslObject(payload as hslColorObject),
                row: rowKey,
                column: columnIndex
            })
        }

    }

    return <div className='colorRow'>
        {[...Array(numColumns).keys()].map((i: number) =>
        { return (
            <DropTarget
                key = {`${rowKey}: ${i}`}
                onItemDropped={(color: Color) => {
                    if (isActiveRow) onPieceDropped(color, i)
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