import { colorsDataString } from "../../interfaces/types";
import { numPinsPerRow } from "../../constants";
import Color from "../../util/Color";
import Colors from "../../util/Colors";
import ColorPin from "../ColorPin/ColorPin";
import Drag from "../Drag/Drag";
import MinMaxControl from "../MinMaxControl/MinMaxControl";

import './ColorBuckets.css';

interface colorBucketsProps {
    baseColorsDataString: colorsDataString;
    shouldReset: boolean;
}

const ColorBuckets = (props: colorBucketsProps) => {
    const { baseColorsDataString, shouldReset } = props;

    const baseColors = Colors.deserialize(baseColorsDataString);

    return <div className="color-buckets">
        {baseColors.map((color: Color) => {
            return (
                <div key={color.hue - 1440} className='color-bucket'>
                    <Drag key={color.hue - 720} dragPayloadObject={{
                        hue: color.hue,
                        saturation: color.saturation,
                        lightness: color.lightness
                    }}>
                        <ColorPin key={color.hue} color={color}/>
                    </Drag>
                    <MinMaxControl
                    key={color.hue + 720}
                    absoluteMin={0}
                    absoluteMax={numPinsPerRow}
                    shouldReset={shouldReset}
                    />
                </div>
            )
        })}
    </div>
}

export default ColorBuckets;