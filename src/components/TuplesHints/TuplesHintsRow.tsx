import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { hslColorObject } from "../../interfaces/interfaces";
import useGameStore from "../../store/gameStore";
import Color from "../../util/Color";

import Colors from "../../util/Colors";
import ColorPin from "../ColorPin/ColorPin";
import DropTarget from "../DropTarget/DropTarget";

import './TuplesHintsRow.css';
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

interface tuplesHintsRowProps {
    rowIndex: number
}

const TuplesHintsRow = (props: tuplesHintsRowProps) => {
    const { rowIndex } = props;

    const {
        combinationNotes,
        disabledColorsDataString,
        addColorTupleSlot,
        changeCombinationNote,
        deleteColorTupleRow,
        placeTupleColor,
    } = useGameStore((state) => {
        const {
            hints,
            addColorTupleSlot,
            changeCombinationNote,
            placeTupleColor,
            deleteColorTupleRow
        } = state;
        const { combinationNotes, disabledColorsDataString } = hints;
        return {
            combinationNotes,
            disabledColorsDataString,
            addColorTupleSlot,
            changeCombinationNote,
            deleteColorTupleRow,
            placeTupleColor,
        };
    })

    const colorTuple = Colors.deserialize(combinationNotes[rowIndex][0]);

    const disabledColors = Colors.deserialize(disabledColorsDataString);

    const onColorDropped = (colorObject: hslColorObject, columnIndex: number) => {
        placeTupleColor({
            color: Color.makeFromHslObject(colorObject),
            rowIndex,
            columnIndex
        })
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
                        isDisabled={disabledColors.has(color)}
                    />
                </DropTarget>

            })}
            <button className='add-tuple-slot-button' onClick={onClickAddTupleSlotButton}>
                <FontAwesomeIcon icon={faPlus} size="sm"/>
            </button>
            <input
                type="text"
                className='tuple-row-note'
                value={combinationNotes[rowIndex][1]}
                onChange={onChangeNote}
            />
            <button className='delete-tuple-row-button' onClick={onClickDeleteTupleRowButton}>
                <FontAwesomeIcon icon={faTrashCan} size="sm"/>
            </button>
        </div>
    );

}

export default TuplesHintsRow;