import useGameStore from "../../store/gameStore";
import Color from "../../util/Color";

import Colors from "../../util/Colors";
import ColorPin from "../ColorPin/ColorPin";

import './TuplesHintsRow.css';

interface tuplesHintsRowProps {
    rowIndex: number
}

const TuplesHintsRow = (props: tuplesHintsRowProps) => {
    const { rowIndex } = props;

    const { colorTuple } = useGameStore((state) => {
        const { hints } = state;
        const { colorTuplesDataStrings } = hints;
        const colorTuple = Colors.deserialize(colorTuplesDataStrings[rowIndex]);
        return { colorTuple };
    })

    return (
        <div className="tuples-hints-row">
            {colorTuple.map((color: Color, index: number) => {
                return <ColorPin
                color={color}
                key={index}
                />
            })}
        </div>
    );

}

export default TuplesHintsRow;