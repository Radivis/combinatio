import ColorPin from "../ColorPin/ColorPin";
import Color from "../../util/Color";
import Colors from "../../util/Colors";
import DropTarget from "../DropTarget/DropTarget";
import { hslColorObject } from "../../interfaces/interfaces";
import { gameStates, pieceTypes } from "../../constants";

import './ColorRow.css';
import useGameStore from "../../store/gameStore";
import Drag from "../Drag/Drag";

interface colorRowProps {
    rowIndex: number;
    numColumns: number;
    isActiveRow: boolean;
}

const ColorRow = (props: colorRowProps) => {
    const { rowIndex, numColumns, isActiveRow } = props;

    let {
        areTranspositionsActive,
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
        const { areTranspositionsActive } = state.displaySettings;
        const { gameState, solutionColorsDataString, solutionIconNames } = state.game;
        const { rowColorsDataString, rowIconNames } = state.game.gameRows[rowIndex];
        return {
            areTranspositionsActive,
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
        if ( areTranspositionsActive === true
        &&'sourceGameColumnIndex' in payload
        && payload.sourceGameColumnIndex !== undefined
        && typeof payload.sourceGameColumnIndex === 'number'
        && 'sourceGameRowIndex' in payload
        && payload.sourceGameRowIndex !== undefined
        && typeof payload.sourceGameRowIndex === 'number'
        && payload.sourceGameRowIndex === rowIndex) {
            // Transposition within the active row
            const targetColor = rowColors[columnIndex];
            const targetIconName = rowIconNames[columnIndex];
            placeColor({
                color: targetColor,
                row: rowIndex,
                column: payload.sourceGameColumnIndex
            })
            placeIcon({
                iconName: targetIconName,
                row: rowIndex,
                column: payload.sourceGameColumnIndex
            })
        }

        if ('iconName' in payload && typeof payload['iconName'] === 'string') {
            // Icon is encoded via iconName
            const { iconName } = payload;
            placeIcon({
                iconName,
                row: rowIndex,
                column: columnIndex
            })
        }
        if ('hue' in payload && typeof payload['hue'] === 'number') {
            // Color is encoded via hslColorObject
            placeColor({
                color: Color.makeFromHslObject(payload as hslColorObject),
                row: rowIndex,
                column: columnIndex
            })
        }
    }

    return <div className='colorRow'>
        {[...Array(numColumns).keys()].map((columnIndex: number) => {
            const color = rowColors[columnIndex];
            const iconName = rowIconNames[columnIndex];
            return (
            <DropTarget
                key = {`${rowIndex}: ${columnIndex}`}
                onItemDropped={(color: Color) => {
                    if (isActiveRow) onPieceDropped(color, columnIndex)
                }}>
                <Drag
                    isActive={true}
                    dragPayloadObject={{
                        hue: color.hue,
                        saturation: color.saturation,
                        lightness: color.lightness,
                        iconName,
                        sourceGameRowIndex: rowIndex,
                        sourceGameColumnIndex: columnIndex,
                    }}>
                    <ColorPin
                        contextType="game"
                        key = {`${rowIndex}: ${columnIndex}`}
                        columnIndex = {columnIndex}
                        rowIndex = {rowIndex}
                        color = {color}
                        iconName = {iconName}
                        areIconsTransparent = {pieceType !== pieceTypes.icon}
                        isSelectionTarget = {true}
                        canRenderColorSelector = {isActiveRow
                            && (pieceType === pieceTypes.color || pieceType === pieceTypes.colorIcon)}
                        canRenderIconSelector = {isActiveRow
                            && (pieceType === pieceTypes.icon || pieceType === pieceTypes.colorIcon)}
                    />
                </Drag>
            </DropTarget>
        )})
        }
    </div>
}

export default ColorRow;