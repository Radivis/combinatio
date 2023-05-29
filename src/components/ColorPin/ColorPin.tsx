import { useState, useEffect } from "react";

import Color from "../../util/Color";

import './ColorPin.css';

interface ColorPinProps {
    color: Color;
    isOpacityToogleActive?: boolean
    shouldReset?: boolean
}

const ColorPin = (props: ColorPinProps) => {
    const { color, isOpacityToogleActive, shouldReset } = props;

    const [isOpaque, setIsOpaque] = useState<boolean>(false);

    const className=`colorPin ${isOpaque ? 'opaque' : ''}`.trim();

    const onClick = (ev: any) => {
        if (isOpacityToogleActive) {
            setIsOpaque((prevIsOpaque) => !prevIsOpaque);
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