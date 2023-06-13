import { colorsDataString } from "../../interfaces/types";
import useGameStore from "../../store/gameStore";
import Color from "../../util/Color";
import Colors from "../../util/Colors";
import ColorPin from "../ColorPin/ColorPin";
import Drag from "../Drag/Drag";
import MinMaxControl from "../MinMaxControl/MinMaxControl";

import './ColorBuckets.css';

interface colorBucketsProps {
    numColumns: number;
    maxIdenticalColorsInSolution: number;
    baseColorsDataString: colorsDataString;
    areColorAmountHintsActive: boolean;
    shouldReset: boolean;  
}

const ColorBuckets = (props: colorBucketsProps) => {
    const {
        maxIdenticalColorsInSolution,
        baseColorsDataString,
        areColorAmountHintsActive,
        shouldReset
    } = props;

    const { colorsMinMax, setColorMinMax } = useGameStore((state) => {
        const { setColorMinMax } = state;
        const { colorsMinMax } = state.hints;
        return { colorsMinMax, setColorMinMax };
    })

    const baseColors = Colors.deserialize(baseColorsDataString);

    return <div className="color-buckets">
        {baseColors.map((color: Color, colorIndex: number) => {
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
                            colorIndex={colorIndex}
                            isOpacityToogleActive={true}
                            isDisabled={colorsMinMax[colorIndex][1] === 0}
                            shouldReset={shouldReset}
                        />
                    </Drag>
                    {areColorAmountHintsActive ? <MinMaxControl
                        key={color.hue + 720}
                        absoluteMin={0}
                        setMinCallback={(min:number) => setColorMinMax({ colorIndex, min })}
                        setMaxCallback={(max:number) => setColorMinMax({ colorIndex, max })}
                        absoluteMax={maxIdenticalColorsInSolution}
                        shouldReset={shouldReset}
                        /> : null
                    }
                </div>
            )
        })}
    </div>
}

export default ColorBuckets;