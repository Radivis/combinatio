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
}

const ColorPin = (props: ColorPinProps) => {
    const {
        color,
        isOpacityToogleActive,
        isDisabledToggleActive,
        isDisabled,
        opacityToogleCallback,
    } = props;

    let {isOpaque} = props;
    if (isOpaque === undefined) isOpaque = false;

    const { toggleDisableColor } = useGameStore((state) => {
        const { toggleDisableColor } = state;
        return { toggleDisableColor };
    })

    const className=`colorPin ${isOpaque ? 'opaque' : ''} ${isDisabled ? 'disabled' : ''}`.trim();

    const onClick = (ev: any) => {
        // enable color in any case by clicking, if it is disabled
        if (isDisabled) toggleDisableColor(color);
        else {
            if (isDisabledToggleActive) {
                toggleDisableColor(color);
            } else if (isOpacityToogleActive && opacityToogleCallback !== undefined) {
                opacityToogleCallback(color);
            }
        }
    }

    // This case shouldn't happen, it's just for error handling
    const style = color !== undefined ? {backgroundColor: color.hsl} : {};

    return <div className={className} style={style} onClick={onClick}></div>;
};

export default ColorPin;