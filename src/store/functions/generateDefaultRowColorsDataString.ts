import { holeHue, holeLightness, holeSaturation } from "../../constants";
import { colorsDataString } from "../../interfaces/types";
import Color from "../../util/Color";
import Colors from "../../util/Colors";

const generateDefaultRowColorsDataString = (numColumns: number): colorsDataString => Colors.serialize(new Colors(
    {
        color: new Color(holeHue, holeSaturation, holeLightness),
        length: numColumns
    }
));

export default generateDefaultRowColorsDataString;
