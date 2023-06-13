import { useState, useEffect } from "react";

import Color from "../../util/Color";

import './ColorPin.css';
import useGameStore from "../../store/gameStore";

interface ColorPinProps {
    color: Color;
    colorIndex?: number;
    isOpacityToogleActive?: boolean
    isDisabled?: boolean,
    shouldReset?: boolean
}

const ColorPin = (props: ColorPinProps) => {
    const { color, colorIndex, isOpacityToogleActive, isDisabled, shouldReset } = props;

    const { colorsMinMax, setColorMinMax } = useGameStore((state) => {
        const { setColorMinMax } = state;
        const { colorsMinMax } = state.hints;
        return { colorsMinMax, setColorMinMax };
    })

    const [isOpaque, setIsOpaque] = useState<boolean>(false);

    if (isDisabled === true && !isOpaque) setIsOpaque(true);

    const className=`colorPin ${isOpaque ? 'opaque' : ''}`.trim();

    const onClick = (ev: any) => {
        if (isOpacityToogleActive) {
            setIsOpaque((prevIsOpaque) => {
                if (prevIsOpaque === true
                    && colorIndex !== undefined
                    && colorsMinMax[colorIndex][1] === 0
                    ) {
                    setColorMinMax({colorIndex, max: 1});
                } 
                return !prevIsOpaque
            });
        }
    }

    // Reset opacity
    useEffect(() => {
        if (shouldReset) {
            setIsOpaque(false);
        }
    }, [shouldReset]);

    return <div className={className} style={{backgroundColor: color.hsl}} onClick={onClick}></div>;
};

export default ColorPin;