import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { hslColorObject } from "../../interfaces/interfaces";
import useGameStore from "../../store/gameStore";
import Color from "../../util/Color";

import Colors from "../../util/Colors";
import ColorPin from "../ColorPin/ColorPin";
import DropTarget from "../DropTarget/DropTarget";

import './CombinationNotesRow.css';
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import ColorIcons from "../../util/ColorIcons";
import ColorIcon from "../../util/ColorIcon";
import { pieceTypes } from "../../constants";
import Drag from "../Drag/Drag";

interface tuplesHintsRowProps {
    rowIndex: number
}

const CombinationNotesRow = (props: tuplesHintsRowProps) => {
    const { rowIndex } = props;

    const {
        areTranspositionsActive,
        combinationNotes,
        disabledColorsDataString,
        pieceType,
        addColorTupleSlot,
        changeCombinationNote,
        deleteColorTupleRow,
        placeTupleColor,
        placeTupleIcon,
    } = useGameStore((state) => {
        const {
            hints,
            addColorTupleSlot,
            changeCombinationNote,
            placeTupleColor,
            placeTupleIcon,
            deleteColorTupleRow
        } = state;
        const { pieceType } = state.gameSettings;
        const { areTranspositionsActive }= state.displaySettings;
        const { combinationNotes, disabledColorsDataString } = hints;
        return {
            areTranspositionsActive,
            combinationNotes,
            disabledColorsDataString,
            pieceType,
            addColorTupleSlot,
            changeCombinationNote,
            deleteColorTupleRow,
            placeTupleColor,
            placeTupleIcon,
        };
    })

    const colorIconTuple = ColorIcons.deserialize(combinationNotes[rowIndex][0]);

    const disabledColors = Colors.deserialize(disabledColorsDataString);

    const onPieceDropped = (payload: object, columnIndex: number) => {
        if ( areTranspositionsActive === true
            &&'sourceCombinationNotesColumnIndex' in payload
            && payload.sourceCombinationNotesColumnIndex !== undefined
            && typeof payload.sourceCombinationNotesColumnIndex === 'number'
            && 'sourceCombinationNotesRowIndex' in payload
            && payload.sourceCombinationNotesRowIndex !== undefined
            && typeof payload.sourceCombinationNotesRowIndex === 'number'
            && payload.sourceCombinationNotesRowIndex === rowIndex) {
                // Transposition within the same row
                const rowColorIcons = ColorIcons.deserialize(combinationNotes[rowIndex][0]);
                const targetColorIcon = rowColorIcons[columnIndex];
                placeTupleColor({
                    color: targetColorIcon.color,
                    rowIndex: rowIndex,
                    columnIndex: payload.sourceCombinationNotesColumnIndex,
                })
                placeTupleIcon({
                    iconName: targetColorIcon.iconName,
                    rowIndex: rowIndex,
                    columnIndex: payload.sourceCombinationNotesColumnIndex,
                })
            }

        if ('iconName' in payload && typeof payload['iconName'] === 'string') {
            // Icon is encoded via iconName
            const { iconName } = payload;
            placeTupleIcon({
                iconName,
                rowIndex,
                columnIndex
            })
        } 
        if ('hue' in payload && typeof payload['hue'] === 'number') {
            // Color is encoded via hslColorObject
            placeTupleColor({
                color: Color.makeFromHslObject(payload as hslColorObject),
                rowIndex,
                columnIndex
            })
        }

    }

    const onClickAddTupleSlotButton = () => {
        addColorTupleSlot(rowIndex);
    }

    const onClickDeleteTupleRowButton = () => {
        deleteColorTupleRow(rowIndex);
    }

    const onChangeNote = (ev: any) => {
        changeCombinationNote(rowIndex, ev.target.value)
    } 

    return (
        <div className="combination-notes-row">
            {colorIconTuple.map((colorIcon: ColorIcon, columnIndex: number) => {
                return <DropTarget
                    key = {`${rowIndex}: ${columnIndex}`}
                    onItemDropped={(payload: object) => {
                        onPieceDropped(payload, columnIndex)
                }}>
                    <Drag
                    isActive={true}
                    dragPayloadObject={{
                        hue: colorIcon.hue,
                        saturation: colorIcon.saturation,
                        lightness: colorIcon.lightness,
                        iconName: colorIcon.iconName,
                        sourceCombinationNotesRowIndex: rowIndex,
                        sourceCombinationNotesColumnIndex: columnIndex,
                    }}>
                        <ColorPin
                            color={colorIcon.color}
                            contextType="combination-notes"
                            columnIndex={columnIndex}
                            rowIndex={rowIndex}
                            iconName={colorIcon.iconName}
                            key={columnIndex}
                            isDisabled={disabledColors.has(colorIcon.color)}
                            areIconsTransparent = {pieceType !== pieceTypes.icon}
                            canRenderColorSelector={pieceType === pieceTypes.color || pieceType === pieceTypes.colorIcon}
                            canRenderIconSelector={pieceType === pieceTypes.icon || pieceType === pieceTypes.colorIcon}
                        />
                    </Drag>
                </DropTarget>

            })}
            <button className='add-tuple-slot-button' onClick={onClickAddTupleSlotButton}>
                <FontAwesomeIcon icon={faPlus} size="sm"/>
            </button>
            <input
                type='text'
                className='tuple-row-note'
                placeholder='combination comment'
                value={combinationNotes[rowIndex][1]}
                onChange={onChangeNote}
            />
            <button className='delete-tuple-row-button' onClick={onClickDeleteTupleRowButton}>
                <FontAwesomeIcon icon={faTrashCan} size="sm"/>
            </button>
        </div>
    );

}

export default CombinationNotesRow;