import Color from "../../util/Color";

import './ColorPin.css';

interface ColorPinProps {
    color: Color;
}

const ColorPin = (props: ColorPinProps) => {
    const { color } = props;
    return <div className='colorPin' style={{backgroundColor: color.hsl}}></div>;
};

export default ColorPin;