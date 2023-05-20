import Color from "../../util/Color";
import ColorPin from "../ColorPin/ColorPin";
import Drag from "../Drag/Drag";

interface colorBucketsProps {
    baseColors: Color[];
}

const ColorBuckets = (props: colorBucketsProps) => {
    const { baseColors } = props;

    return <div className="color-buckets">
        {baseColors.map((color: Color, index: number) => {
            return (
                <Drag dragPayloadObject={{
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