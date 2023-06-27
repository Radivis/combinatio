import { useState, useEffect } from "react";

import Color from "../../util/Color";

import './ColorPin.css';
import useGameStore from "../../store/gameStore";

interface ColorPinProps {
    color: Color;
    colorIndex?: number;
    isDisabled?: boolean,
    isOpaque?: boolean,
    isOpacityToogleActive?: boolean,
    isDisabledToggleActive?: boolean,
    opacityToogleCallback?: (color: Color) => void,
    shouldReset?: boolean
}

const ColorPin = (props: ColorPinProps) => {
    const {
        color,
        colorIndex,
        isOpacityToogleActive,
        isDisabledToggleActive,
        isDisabled,
        shouldReset,
        opacityToogleCallback,
    } = props;

    let {isOpaque} = props;
    if (isOpaque === undefined) isOpaque = false;

    const { colorsMinMax, setColorMinMax, toggleDisableColor } = useGameStore((state) => {
        const { setColorMinMax, toggleDisableColor } = state;
        const { colorsMinMax } = state.hints;
        return { colorsMinMax, setColorMinMax, toggleDisableColor };
    })

    // const [isOpaque, setIsOpaque] = useState<boolean>(false);

    const className=`colorPin ${isOpaque ? 'opaque' : ''} ${isDisabled ? 'disabled' : ''}`.trim();

    const onClick = (ev: any) => {
        // enable color in any case by clicking, if it is disabled
        if (isDisabled) toggleDisableColor(color);
        else {
            if (isDisabledToggleActive) {
                toggleDisableColor(color);
            } else if (isOpacityToogleActive && opacityToogleCallback !== undefined) {
                opacityToogleCallback(color);
                // setIsOpaque((prevIsOpaque) => {
                //     // if (prevIsOpaque === true
                //     //     && colorIndex !== undefined
                //     //     && colorsMinMax[colorIndex][1] === 0
                //     //     ) {
                //     //     setColorMinMax({colorIndex, max: 1});
                //     // }
                //     return !prevIsOpaque
                // });
            }
        }
    }

    // Reset opacity
    // useEffect(() => {
    //     if (shouldReset) {
    //         setIsOpaque(false);
    //     }
    // }, [shouldReset]);

    return <div className={className} style={{backgroundColor: color.hsl}} onClick={onClick}></div>;
};

export default ColorPin;