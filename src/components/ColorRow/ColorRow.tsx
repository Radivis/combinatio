import ColorPin from "../ColorPin/ColorPin";
import Color from "../../util/Color";
import Colors from "../../util/Colors";
import DropTarget from "../DropTarget/DropTarget";
import { hslColorObject } from "../../interfaces/interfaces";
import { gameStates, pieceTypes } from "../../constants";

import './ColorRow.css';
import useGameStore from "../../store/gameStore";

interface colorRowProps {
    rowIndex: number;
    numColumns: number;
    isActiveRow: boolean;
}

const ColorRow = (props: colorRowProps) => {
    const { rowIndex, numColumns, isActiveRow } = props;

    let {
        gameState,
        pieceType,
        rowColorsDataString,
        rowIconNames,
        solutionColorsDataString,
        solutionIconNames,
        placeColor,
        placeIcon
    } = useGameStore((state) => {
        const { placeColor, placeIcon } = state;
        const { pieceType } = state.gameSettings;
        const { gameState, solutionColorsDataString, solutionIconNames } = state.game;
        const { rowColorsDataString, rowIconNames } = state.game.gameRows[rowIndex];
        return {
            gameState,
            pieceType,
            rowColorsDataString,
            rowIconNames,
            solutionColorsDataString,
            solutionIconNames,
            placeColor,
            placeIcon
        };
    })

    let rowColors = Colors.deserialize(rowColorsDataString);
    if (rowIndex === 0
        && gameStates.slice(2,4).includes(gameState)) {
            rowColors = Colors.deserialize(solutionColorsDataString);
            rowIconNames = solutionIconNames;
        }

    const onPieceDropped = (payload: object, columnIndex: number) => {
        if ('iconName' in payload && typeof payload['iconName'] === 'string') {
            // Icon is encoded via iconName
            const { iconName } = payload;
            placeIcon({
                iconName,
                row: rowIndex,
                column: columnIndex
            })
        } else {
            // Color is encoded via hslColorObject
            placeColor({
                color: Color.makeFromHslObject(payload as hslColorObject),
                row: rowIndex,
                column: columnIndex
            })
        }

    }

    return <div className='colorRow'>
        {[...Array(numColumns).keys()].map((columnIndex: number) =>
        { return (
            <DropTarget
                key = {`${rowIndex}: ${columnIndex}`}
                onItemDropped={(color: Color) => {
                    if (isActiveRow) onPieceDropped(color, columnIndex)
                }}>
                <ColorPin
                    contextType="game"
                    key = {`${rowIndex}: ${columnIndex}`}
                    columnIndex = {columnIndex}
                    rowIndex = {rowIndex}
                    color = {rowColors[columnIndex]}
                    iconName = {rowIconNames[columnIndex]}
                    areIconsTransparent = {pieceType !== pieceTypes.icon}
                    canRenderColorSelector = {isActiveRow
                        && (pieceType === pieceTypes.color || pieceType === pieceTypes.colorIcon)}
                    canRenderIconSelector = {isActiveRow
                        && (pieceType === pieceTypes.icon || pieceType === pieceTypes.colorIcon)}
                />
            </DropTarget>
        )})
        }
    </div>
}

export default ColorRow;