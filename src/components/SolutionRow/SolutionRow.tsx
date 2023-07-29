import Color from "../../util/Color";
import ColorRow from "../ColorRow/ColorRow";

import '../GameRow/GameRow.css';
import './SolutionRow.css'

interface solutionRowProps {
    numColumns: number;
    solutionColors: Color[];
    initialColors: Color[];
    gameState: string;
}

const SolutionRow = (props: solutionRowProps) => {
    const {
        numColumns,
    } = props;

    return <div className="solution-row">
        <ColorRow
            rowIndex = {0}
            numColumns={numColumns}
            isActiveRow = {false}
        />
    </div>
}

export default SolutionRow;
