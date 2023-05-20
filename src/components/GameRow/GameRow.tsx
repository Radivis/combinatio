import { useState } from "react";

import Color from "../../util/Color";
import ColorRow from "../ColorRow/ColorRow";

interface gameRowProps {
    rowKey: number;
    solutionColors: Color[];
    colors: Color[];
}

const GameRow = (props: gameRowProps) => {
    const { rowKey, colors, solutionColors } = props;
    return <div>
        {rowKey}
        <ColorRow
            initialColors = {colors}
        />
    </div>
}

export default GameRow;
