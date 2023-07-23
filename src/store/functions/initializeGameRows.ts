import { gameRow } from "../../interfaces/interfaces";
import { range } from "../../util/range";
import generateDefaultRowColorsDataString from "./generateDefaultRowColorsDataString";

const initializeGameRows = (numRows: number, numColumns: number): gameRow[] => range(numRows + 1)
.map((_rowIndex: number) => {
    return {
        rowColorsDataString: generateDefaultRowColorsDataString(numColumns),
        numCorrectColor: 0,
        numFullyCorrect: 0,
    }
})

export default initializeGameRows;