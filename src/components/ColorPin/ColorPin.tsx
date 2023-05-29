import { useState } from "react";

import Color from "../../util/Color";

import './ColorPin.css';

interface ColorPinProps {
    color: Color;
    isOpacityToogleActive?: boolean
}

const ColorPin = (props: ColorPinProps) => {
    const { color, isOpacityToogleActive } = props;

    const [isOpaque, setIsOpaque] = useState<boolean>(false);

    const className=`colorPin ${isOpaque ? 'opaque' : ''}`.trim();

    const onClick = (ev: any) => {
        if (isOpacityToogleActive) {
            setIsOpaque((prevIsOpaque) => !prevIsOpaque);
        }
    }

    return <div className={className} style={{backgroundColor: color.hsl}} onClick={onClick}></div>;
};

export default ColorPin;