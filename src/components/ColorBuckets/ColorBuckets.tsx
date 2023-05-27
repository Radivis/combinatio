import { colorsDataString } from "../../interfaces/types";
import Color from "../../util/Color";
import Colors from "../../util/Colors";
import ColorPin from "../ColorPin/ColorPin";
import Drag from "../Drag/Drag";

interface colorBucketsProps {
    baseColorsDataString: colorsDataString;
}

const ColorBuckets = (props: colorBucketsProps) => {
    const { baseColorsDataString } = props;

    const baseColors = Colors.deserialize(baseColorsDataString);

    return <div className="color-buckets">
        {baseColors.map((color: Color, index: number) => {
            return (
                <Drag key={index} dragPayloadObject={{
                    hue: color.hue,
                    saturation: color.saturation,
                    lightness: color.lightness
                }}>
                    <ColorPin key={index} color={color}/>
                </Drag>
            )
        })}
    </div>
}

export default ColorBuckets;