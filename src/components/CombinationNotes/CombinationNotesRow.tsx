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

interface tuplesHintsRowProps {
    rowIndex: number
}

const CombinationNotesRow = (props: tuplesHintsRowProps) => {
    const { rowIndex } = props;

    const {
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
        const { combinationNotes, disabledColorsDataString } = hints;
        return {
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

    // const onColorDropped = (colorObject: hslColorObject, columnIndex: number) => {
    //     placeTupleColor({
    //         color: Color.makeFromHslObject(colorObject),
    //         rowIndex,
    //         columnIndex
    //     })
    // }

    const onPieceDropped = (payload: object, columnIndex: number) => {
        if ('iconName' in payload && typeof payload['iconName'] === 'string') {
            // Icon is encoded via iconName
            const { iconName } = payload;
            placeTupleIcon({
                iconName,
                rowIndex,
                columnIndex
            })
        } else {
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