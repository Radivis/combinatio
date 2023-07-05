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
}

const ColorBuckets = (props: colorBucketsProps) => {
    const {
        maxIdenticalColorsInSolution,
        baseColorsDataString,
        areColorAmountHintsActive,
    } = props;

    const { colorsMinMax, disabledColorsDataString, setColorMinMax } = useGameStore((state) => {
        const { setColorMinMax } = state;
        const { colorsMinMax, disabledColorsDataString } = state.hints;
        return { colorsMinMax, disabledColorsDataString, setColorMinMax };
    })

    const disabledColors = Colors.deserialize(disabledColorsDataString);

    const baseColors = Colors.deserialize(baseColorsDataString);

    return <div className="color-buckets">
        {baseColors.map((color: Color, colorIndex: number) => {
            return (
                <div key={color.hue - 1440} className='color-bucket'>
                    <Drag
                        key={color.hue - 720}
                        isActive={!disabledColors.has(color)}
                        dragPayloadObject={{
                            hue: color.hue,
                            saturation: color.saturation,
                            lightness: color.lightness,
                        }}>
                        <ColorPin
                            key={color.hue}
                            color={color}
                            colorIndex={colorIndex}
                            isDisabledToggleActive={true}
                            isDisabled={disabledColors.has(color)}
                        />
                    </Drag>
                    {areColorAmountHintsActive ? <MinMaxControl
                        key={color.hue + 720}
                        absoluteMin={0}
                        min={colorsMinMax[colorIndex][0]}
                        max={colorsMinMax[colorIndex][1]}
                        setMin={(min:number) => setColorMinMax({ colorIndex, min })}
                        setMax={(max:number) => setColorMinMax({ colorIndex, max })}
                        absoluteMax={maxIdenticalColorsInSolution}
                        /> : null
                    }
                </div>
            )
        })}
    </div>
}

export default ColorBuckets;