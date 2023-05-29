import { colorsDataString } from "../../interfaces/types";
import Color from "../../util/Color";
import Colors from "../../util/Colors";
import ColorPin from "../ColorPin/ColorPin";
import Drag from "../Drag/Drag";
import MinMaxControl from "../MinMaxControl/MinMaxControl";

import './ColorBuckets.css';

interface colorBucketsProps {
    numColumns: number;
    baseColorsDataString: colorsDataString;
    areColorAmountHintsActive: boolean;
    shouldReset: boolean;  
}

const ColorBuckets = (props: colorBucketsProps) => {
    const { numColumns, baseColorsDataString, areColorAmountHintsActive, shouldReset } = props;

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
                        <ColorPin
                            key={color.hue}
                            color={color}
                            isOpacityToogleActive={true}
                            shouldReset={shouldReset}
                        />
                    </Drag>
                    {areColorAmountHintsActive ? <MinMaxControl
                        key={color.hue + 720}
                        absoluteMin={0}
                        absoluteMax={numColumns}
                        shouldReset={shouldReset}
                        /> : null
                    }
                </div>
            )
        })}
    </div>
}

export default ColorBuckets;